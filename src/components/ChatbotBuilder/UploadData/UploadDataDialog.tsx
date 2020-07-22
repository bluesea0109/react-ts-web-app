import { Button, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import ApolloClient from 'apollo-client';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import _ from 'lodash';
import React from 'react';
import { withApollo } from 'react-apollo';
import { CHATBOT_CREATE_TAGS } from '../../../common-gql-queries';
import { IExampleInput, UtteranceAction } from '../../../models/chatbot-service';
import { createIntentMutation } from '../Intent/gql';
import { createActionMutation, getActionsQuery } from '../Actions/gql';
import { IAgentData, IAgentAction, IAgentDataIntent, IAgentDataExample, IAgentDataIntentGqlVars  } from './types';
import { ActionType } from '../../../models/chatbot-service';

interface IUploadDataDialogProps {
  agentId: number;
  client: ApolloClient<object>;
}

interface IUploadDataDialogState {
  open: boolean;
  progress: number;
  numCompleted: number;
  total: number;
  error: GraphQLError | null;
  status: string;
}

class UploadDataDialog extends React.Component<IUploadDataDialogProps, IUploadDataDialogState> {
  constructor(props: IUploadDataDialogProps) {
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

    const res = await this.props.client.mutate({
      mutation: UPLOAD_EXAMPLES,
      variables: {
        agentId: this.props.agentId,
        examples,
      },
    });

    if (res.errors?.[0]) {
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
      status: "Creating utterance actions",
    });

    const mutation = createActionMutation(ActionType.UTTERANCE_ACTION);

    // Todo Add a Backend Mutation to upload multiple actions at once 
    
    let mutations = actions.map((a)=> {
      return this.props.client.mutate({
        mutation: mutation,
        variables: {
          agentId: this.props.agentId,
          text: a.text,
          name: a.name
        }
      });
    });

    try { 
      await Promise.all(mutations);

    } catch(e) {
      console.error("Error: ", e);
    }

    console.log("Mutations completed");

    let savedActions = await this.props.client.query({
      query: getActionsQuery,
      fetchPolicy: "network-only",
      variables: {
        agentId: this.props.agentId
      }
    });

    this.setState({
      status: '',
    });

    return _.get(savedActions, "data.ChatbotService_actions") || [];

  }

  uploadIntents = async (intents: IAgentDataIntent[], actions: UtteranceAction[] ): Promise<Map<string, number>> => {
    this.setState({
      status: 'Creating intents',
    });

    const res = await this.props.client.mutate({
      mutation: createIntentMutation,
      variables: {
        agentId: this.props.agentId,
        intents: intents.map((x) => {
          let intent:IAgentDataIntentGqlVars = {
            value: x.intent,
          };

          if(typeof x.defaultAction === "number") {
            intent.defaultAction = x.defaultAction;
          }
          else if(typeof x.defaultAction === "string") {
            let action = _.find(actions, { 
              name: x.defaultAction
            });
            intent.defaultAction = action?.id || null;
          } 
          return intent;
        }),
      },
    });

    const intentIdsMap = new Map<string, number>();

    const uploadedIntents: any[] = res.data.ChatbotService_createIntents;
    
    uploadedIntents.forEach(x => {
      intentIdsMap.set(x.value, x.id);
    });

    this.setState({
      status: '',
    });

    return intentIdsMap;
  }

  uploadTagTypes = async (tagTypes: string[]): Promise<Map<string, number>> => {
    this.setState({
      status: 'Creating tag types',
    });

    const res = await this.props.client.mutate({
      mutation: CHATBOT_CREATE_TAGS,
      variables: {
        agentId: this.props.agentId,
        values: tagTypes,
      },
    });

    const tagTypeIdsMap = new Map<string, number>();
    const uploadedTagTypes: any[] = res.data.ChatbotService_createTagTypes;
    uploadedTagTypes.forEach(x => {
      tagTypeIdsMap.set(x.value, x.id);
    });

    this.setState({
      status: '',
    });

    return tagTypeIdsMap;
  }

  handleJsonFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let status = "";
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
        status = "Invalid file type";
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
      
      status = "Uploading examples";
      for (const batch of exampleBatches) {
        await this.uploadBatch(batch);
        numCompleted += batch.length;
        const progress = 100.0 * numCompleted / total;
        if(progress === 100) {
          status = "Upload Complete!";
        }
        this.setState({
          status: status,
          numCompleted,
          total,
          progress,
        });
      }
      
    } catch (err) {
      console.error(err);
      this.setState({
        error: err,
      });
    }
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
            {'Something went wrong :('}
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

export default withApollo<IUploadDataDialogProps>(UploadDataDialog);

const UPLOAD_EXAMPLES = gql`
  mutation ($agentId: Int!, $examples: [ChatbotService_ExampleInput!]!) {
    ChatbotService_uploadExamples(agentId: $agentId, examples: $examples)
  }
`;



