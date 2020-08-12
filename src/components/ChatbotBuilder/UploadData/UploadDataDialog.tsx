import { withApollo, WithApolloClient } from '@apollo/client/react/hoc';
import { Button, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import _ from 'lodash';
import React from 'react';
import { CHATBOT_CREATE_TAGS } from '../../../common-gql-queries';
import { IAgentGraphPolicy, IExampleInput, UtteranceAction } from '../../../models/chatbot-service';
import { ActionType } from '../../../models/chatbot-service';
import { createActionMutation, getActionsQuery } from '../Actions/gql';
import { createGraphPolicyMutation } from '../GraphPolicy/gql';
import { createIntentMutation } from '../Intent/gql';
import { createOptionMutation } from '../Options/gql';
import { ICreateUserResponseOptionsMutationVars, IOptionType } from '../Options/types';
import { IAgentAction, IAgentData, IAgentDataExample, IAgentDataIntent,
  IAgentDataIntentGqlVars, IUserResponseOptionExport  } from './types';

interface IUploadDataDialogProps {
  agentId: number;
}

type IProps = WithApolloClient<IUploadDataDialogProps>;

interface IUploadDataDialogState {
  open: boolean;
  progress: number;
  numCompleted: number;
  total: number;
  error: GraphQLError | null;
  status: string;
}

class UploadDataDialog extends React.Component<IProps, IUploadDataDialogState> {
  progressWeight = {
    actions: 20,
    intents: 20,
    graphPolicies: 20,
    options: 20,
    exampleBatches: 20,
  };
  constructor(props: IProps) {
    super(props);

    this.state = {
      open: false,
      progress: 0.0,
      numCompleted: 0,
      total: 1,
      error: null,
      status: '',
    };
  }

  cancelled = false;

  handleClose = () => {
    this.setState({
      open: false,
      numCompleted: 0,
      total: 1,
    });
  }

  uploadBatch = async (examples: IExampleInput[]) => {
    this.setState(s => ({
      ...s,
      status: 'Uploading examples',
    }));

    const res = await this.props.client?.mutate({
      mutation: UPLOAD_EXAMPLES,
      variables: {
        agentId: this.props.agentId,
        examples,
      },
    });

    if (res?.errors?.[0]) {
      console.error(res.errors[0]);
      this.setState({
        error: res.errors[0],
        status: '',
      });
      return;
    }

    this.setState({
      status: '',
    });
  }

  onCancel = () => {
    this.cancelled = true;
    this.handleClose();
  }

  readFile = async (file: File): Promise<IAgentData> => {
    const reader = new FileReader();
    const json = await new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(reader.result);
      };
      reader.readAsText(file, 'utf-8');
    });

    const removeDuplicates = (exs: IAgentDataExample[]) => {
      const seen = new Set<string>();
      const result: IAgentDataExample[] = [];
      exs.forEach(ex => {
        if (seen.has(ex.intent + ex.text)) {
          return;
        }
        seen.add(ex.intent + ex.text);
        result.push(ex);
      });
      return result;
    };

    const data = JSON.parse(json) as IAgentData;
    data.examples = removeDuplicates(data.examples);
    return data;
  }

  uploadUtteranceActions = async(actions: IAgentAction[]): Promise<UtteranceAction[]> => {
    this.setState({
      status: 'Creating utterance actions',
    });

    const mutation = createActionMutation(ActionType.UTTERANCE_ACTION);

    // Todo Add a Backend Mutation to upload multiple actions at once

    const mutations = actions.map((a) => {
      return this.props.client?.mutate({
        mutation,
        variables: {
          agentId: this.props.agentId,
          text: a.text,
          name: a.name,
        },
      });
    });

    try {
      await Promise.all(mutations);
      this.incrProgress(this.progressWeight.actions);

    } catch (e) {
      console.error('Error: ', e);
    }

    const savedActions = await this.props.client?.query({
      query: getActionsQuery,
      fetchPolicy: 'network-only',
      variables: {
        agentId: this.props.agentId,
      },
    });

    this.setState({
      status: '',
    });

    return savedActions?.data?.ChatbotService_actions || [];

  }

  uploadIntents = async (intents: IAgentDataIntent[], actions: UtteranceAction[] ): Promise<Map<string, number>> => {
    this.setState({
      status: 'Creating intents',
    });

    const res = await this.props.client?.mutate({
      mutation: createIntentMutation,
      variables: {
        agentId: this.props.agentId,
        intents: intents.map((x) => {
          const intent: IAgentDataIntentGqlVars = {
            value: x.intent,
          };

          if (typeof x.defaultAction === 'number') {
            intent.defaultAction = x.defaultAction;
          } else if (typeof x.defaultAction === 'string') {
            const action = _.find(actions, {
              name: x.defaultAction,
            });
            intent.defaultAction = action?.id || null;
          }
          return intent;
        }),
      },
    });

    const intentIdsMap = new Map<string, number>();

    const uploadedIntents: any[] = res?.data.ChatbotService_createIntents || [];

    uploadedIntents.forEach(x => {
      intentIdsMap.set(x.value, x.id);
    });

    this.setState({
      status: '',
    });
    this.incrProgress(this.progressWeight.intents);
    return intentIdsMap;
  }

  uploadOptions = async(userResponsOptions: IUserResponseOptionExport[], intentIdsMap: Map<string, number>) => {
    this.setState({
      status: 'Uploading user response options',
    });

    if (userResponsOptions.length === 0) {
      return this.incrProgress(this.progressWeight.options);
    }

    for (const uro of userResponsOptions) {
      const variables: ICreateUserResponseOptionsMutationVars = {
        agentId: this.props.agentId,
        userTextResponseOption: undefined,
        userImageResponseOption: undefined,
      };

      try {
        const intentId = intentIdsMap.get(uro.intent);
        if (!intentId) {
          throw new Error(`Intent Id did not exist for ${uro.intent}`);
        }

        if (uro.type === IOptionType.TEXT) {
          variables.userTextResponseOption = {
            type: uro.type,
            intentId,
            text: uro.text,
          };
        } else if (uro.type === IOptionType.IMAGE_LIST) {
          variables.userImageResponseOption = {
            type: uro.type,
            intentId,
            text: uro.text,
            imageUrl: uro.image_url,
          };
        }

        await this.props.client?.mutate({
          mutation: createOptionMutation,
          variables,
        });
        this.incrProgress(this.progressWeight.options / userResponsOptions.length);
      } catch (e) {
        this.setState({
          error: new GraphQLError(e),
        });
      }
    }
  }

  uploadTagTypes = async (tagTypes: string[]): Promise<Map<string, number>> => {
    this.setState({
      status: 'Creating tag types',
    });

    const res = await this.props.client?.mutate({
      mutation: CHATBOT_CREATE_TAGS,
      variables: {
        agentId: this.props.agentId,
        values: tagTypes,
      },
    });

    const tagTypeIdsMap = new Map<string, number>();
    const uploadedTagTypes: any[] = res?.data.ChatbotService_createTagTypes || [];
    uploadedTagTypes.forEach(x => {
      tagTypeIdsMap.set(x.value, x.id);
    });

    this.setState({
      status: '',
    });

    return tagTypeIdsMap;
  }

  incrProgress = (increment: number) => {
    const p = this.state.progress;
    this.setState({
      progress: p + increment,
    });
  }

  handleJsonFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let status = '';
    try {

      const files = e.target.files;
      if (!files || files.length === 0) { return; }

      const file = files[0];

      this.setState(s => ({
        ...s,
        open: true,
      }));

      if (file.type !== 'application/json') {
        // set error message
        status = 'Invalid file type';
        this.setState(s => ({
          ...s,
          status,
        }));
        return;
      }

      const data = await this.readFile(file);

      let numCompleted = 0;
      const total = data.examples.length;

      this.setState(s => ({
        ...s,
        open: true,
        numCompleted,
        total,
        progress: 0,
      }));

      // Upload Utterance Actions.
      // TODO - modify the backend code to make this an upsert. It currently throws an error if you upload duplicates
      const actions: UtteranceAction[] = await this.uploadUtteranceActions(data.utteranceActions);
      const intentIdsMap = await this.uploadIntents(data.intents, actions);
      const tagTypeIdsMap = await this.uploadTagTypes(data.tagTypes);
      await this.uploadGraphPolicies(data.graphPolicies);
      await this.uploadOptions(data.userResponseOptions, intentIdsMap);

      const preprocessedExamples: IExampleInput[] = data.examples.map(x => {

        const intentId = intentIdsMap.get(x.intent);
        if (!intentId) {
          throw new Error(`Failed to get id for intent: ${x.intent}`);
        }

        return {
          intentId,
          text: x.text,
          tags: x.tags.map(tag => {
            const tagTypeId = tagTypeIdsMap.get(tag.tagType);
            if (!tagTypeId) {
              throw new Error(`Failed to id for tagType: ${tag.tagType}`);
            }
            return {
              start: tag.start,
              end: tag.end,
              tagTypeId,
            };
          }),
        };
      });

      const exampleBatches = _.chunk(preprocessedExamples, 100);

      status = 'Uploading examples';
      for (const batch of exampleBatches) {
        await this.uploadBatch(batch);
        numCompleted += batch.length;
        const progress = numCompleted / total;
        this.setState({
          status,
          numCompleted,
          total,
        });
        this.incrProgress(progress * this.progressWeight.exampleBatches);
      }

    } catch (err) {
      console.error(err);
      this.setState({
        error: err,
      });
    }

    if (this.state.error === null) {
      this.setState({
        progress: 100,
      });
    }

  }

  uploadGraphPolicies = async(graphPolicies: IAgentGraphPolicy[]): Promise<void> => {
    this.setState({
      status: 'Uploading Graph Policies',
    });

    if (graphPolicies.length === 0) {
      return this.incrProgress(this.progressWeight.graphPolicies);
    }

    for (const gp of graphPolicies) {
      const gpData = _.pick(gp, ['name', 'data']);
      try {
        await this.props.client?.mutate({
          mutation: createGraphPolicyMutation,
          variables: {
            agentId: this.props.agentId,
            policy: gpData,
          },
        });
        this.incrProgress(this.progressWeight.graphPolicies / graphPolicies.length);
      } catch (e) {
        this.setState({
          error: new GraphQLError(e),
        });
      }
    }

    this.setState({
      status: 'Uploaded Graph Policies',
    });

  }

  render() {
    const state = this.state;

    let dialogContent = (
      <DialogContent>
        <DialogContentText>
          {state.status}
        </DialogContentText>
        <LinearProgress color="secondary" variant="determinate" value={state.progress} />
      </DialogContent>
    );

    if (state.error) {
      console.error(state.error);
      dialogContent = (
        <DialogContent>
          <DialogContentText>
            {JSON.stringify(state.error)}
          </DialogContentText>
          <Typography>{'Please contact support@bavard.ai'}</Typography>
        </DialogContent>
      );
    }

    return (
      <React.Fragment>
        <Dialog
          open={state.open}
          onClose={this.handleClose}
          fullWidth={true}
        >
          <DialogTitle>{'Upload Agent Data'}</DialogTitle>
          {dialogContent}
          <DialogActions>
            {
              this.state.progress === 100
              ?
              <Button color="secondary" onClick={this.handleClose}>
                {'Close'}
              </Button>
              :
              <Button color="secondary" onClick={this.onCancel}>
                {'Cancel'}
              </Button>
            }
          </DialogActions>
        </Dialog>
        <Button
          variant="contained"
          component="label"
          style={{ padding: 6 }}>
          {'Upload JSON File'}
          <input
            name="json"
            id="json"
            accept="application/JSON"
            type="file"
            style={{ display: 'none' }}
            multiple={false}
            onChange={this.handleJsonFile}
          />
        </Button>
      </React.Fragment>
    );
  }
}

export default withApollo<IProps>(UploadDataDialog);

const UPLOAD_EXAMPLES = gql`
  mutation ($agentId: Int!, $examples: [ChatbotService_ExampleInput!]!) {
    ChatbotService_uploadExamples(agentId: $agentId, examples: $examples)
  }
`;
