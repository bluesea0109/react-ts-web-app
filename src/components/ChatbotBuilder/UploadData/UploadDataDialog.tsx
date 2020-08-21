import { ApolloQueryResult } from '@apollo/client';
import { withApollo, WithApolloClient, } from '@apollo/client/react/hoc';
import { Button, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Theme, withStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import gql from 'graphql-tag';
import _ from 'lodash';
import React from 'react';
import { CHATBOT_CREATE_TAGS } from '../../../common-gql-queries';
import { IAgentGraphPolicy, IExampleInput, IUtteranceAction } from '../../../models/chatbot-service';
import { ActionType } from '../../../models/chatbot-service';
import { readAgentZipfile } from '../../../utils/archive';
import {uploadFileWithFetch} from '../../../utils/xhr';
import { createActionMutation, getActionsQuery , updateActionMutation } from '../Actions/gql';
import { botIconUploadQuery } from '../AgentSettings/gql';
import {IBotIconUploadUrlQueryResult} from '../AgentSettings/types';
import { getSignedImgUploadUrlQuery} from '../GraphPolicy/gql';
import { createGraphPolicyMutation, activateGraphPolicyMutation } from '../GraphPolicy/gql';
import {IGetImageUploadSignedUrlQueryResult, ICreateGraphPolicyMutationResult} from '../GraphPolicy/types';
import { createIntentMutation } from '../Intent/gql';
import { createOptionMutation, getOptionsQuery } from '../Options/gql';
import { GetOptionsQueryResult, ICreateUserResponseOptionsMutationVars, IOption, IOptionType } from '../Options/types';
import { IAgentAction, IAgentData, IAgentDataExample, IAgentDataIntent,
  IAgentDataIntentGqlVars, IUserResponseOptionExport  } from './types';

interface IUploadDataDialogProps {
  agentId: number;
  classes: {
    alert: string;
    uploadButton: string;
  };
}

type IProps = WithApolloClient<IUploadDataDialogProps>;

interface IError {
  title: string;
  details: string;
}

interface IUploadDataDialogState {
  open: boolean;
  progress: number;
  numCompleted: number;
  total: number;
  error: IError[];
  status: string;
}
const styles = (theme: Theme) => ({
  alert: {
    'word-break': 'break-word',
  },
  uploadButton: {
    margin: theme.spacing(1),
  },
});

class UploadDataDialog extends React.Component<IProps, IUploadDataDialogState> {
  progressWeight = {
    actions: 5,
    intents: 5,
    graphPolicies: 10,
    options: 10,
    exampleBatches: 10,
    reuploadActionsWithUros: 10,
    uroImages: 25,
    botIcons: 25,
  };
  constructor(props: IProps) {
    super(props);

    this.state = {
      open: false,
      progress: 0.0,
      numCompleted: 0,
      total: 1,
      error: [],
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

  addToErrors = (title: string, details: string) => {
    const errors = this.state.error;
    errors.push({ title, details });
    this.setState({error: errors});
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
      this.addToErrors(`Errors in uploading examples`, JSON.stringify(res.errors[0].message));
      this.setState({
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

  formatJsonData = (json: string): IAgentData => {

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

  updateUtteranceActions = async(actionsFromJson: IAgentAction[],
    actions: IUtteranceAction[], intentIdsMap?: Map<string, number>, uros?: IOption[]): Promise<any> => {
    const mutation = updateActionMutation(ActionType.UTTERANCE_ACTION);

    let mutations = actionsFromJson.map((a) => {
      const id = _.find(actions, { name: a.name })?.id;
      let uroIds = (a.userResponseOptions || []).map((o) => {
        const uro = _.find(uros, { intent: o.intent });
        return uro?.id;
      });

      uroIds = _.compact(uroIds);

      if (id && uroIds.length >= 1) {
        return this.props.client?.mutate({
          mutation,
          variables: {
            actionId: id,
            text: a.text,
            userResponseOptions: uroIds,
          },
        });
      }
      return undefined;
    });

    mutations = _.compact(mutations);
    try {
      await Promise.all(mutations);
    } catch (e) {
      this.addToErrors(`Errors in updating utterance actions`, JSON.stringify(e));
    }
    this.incrProgress(this.progressWeight.reuploadActionsWithUros);

  }

  uploadUtteranceActions = async(actions: IAgentAction[]): Promise<IUtteranceAction[]> => {
    this.setState({
      status: 'Creating utterance actions',
    });

    const mutation = createActionMutation(ActionType.UTTERANCE_ACTION);

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
    } catch (e) {
      console.error('Error: ', e);
      this.addToErrors(`Errors in uploading utterance actions`, JSON.stringify(e));
    }
    this.incrProgress(this.progressWeight.actions);

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

  uploadIntents = async (intents: IAgentDataIntent[], actions: IUtteranceAction[] ): Promise<Map<string, number>> => {
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

    this.incrProgress(this.progressWeight.intents);
    return intentIdsMap;
  }

  uploadOptions = async(userResponsOptions: IUserResponseOptionExport[], intentIdsMap: Map<string, number>): Promise<any> => {
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
        this.addToErrors( `Errors in uploading options`, JSON.stringify(e));
      }
    }

    const savedOptions: ApolloQueryResult<GetOptionsQueryResult>|undefined = await this.props.client?.query({
      query: getOptionsQuery,
      fetchPolicy: 'network-only',
      variables: {
        agentId: this.props.agentId,
      },
    });

    return savedOptions?.data?.ChatbotService_userResponseOptions || [];

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

    return tagTypeIdsMap;
  }

  incrProgress = (increment: number) => {
    const p = this.state.progress;
    this.setState({
      progress: p + increment,
    });
  }

  uploadImage = async(imgFile: File, type: 'uro-images' | 'bot-icons') => {
    let url: string|undefined;

    if (type === 'uro-images') {
      const signedUrl: ApolloQueryResult<IGetImageUploadSignedUrlQueryResult>|undefined = await this.props.client?.query({
        query: getSignedImgUploadUrlQuery,
        variables: {
          agentId: this.props.agentId,
          basename: imgFile.name,
        },
      });

      url = signedUrl?.data?.ChatbotService_imageOptionUploadUrl.url;
    } else if (type === 'bot-icons') {
      const signedUrl: ApolloQueryResult<IBotIconUploadUrlQueryResult>|undefined = await this.props.client?.query({
        query: botIconUploadQuery,
        variables: {
          agentId: this.props.agentId,
          basename: imgFile.name,
        },
      });

      url = signedUrl?.data?.ChatbotService_botIconUploadUrl.url;
    }

    if (!url) {
      this.addToErrors(`Error in uploading Image: ${imgFile.name}`,  `Failed to get signed upload url`);
      return;
    }

    try {
      await uploadFileWithFetch(imgFile, url, 'PUT');
    } catch (e) {
      this.addToErrors(`Error in uploading Image: ${imgFile.name}`,  JSON.stringify(e));
    }
  }

  handleZipFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) { return; }

    const file = files[0];
    const zipContents = await readAgentZipfile(file);
    // JSON config file
    if (zipContents.agentConfig) {
      const data = this.formatJsonData(zipContents.agentConfig);
      await this.processJsonData(data);
    }
    // URO Images
    if (zipContents.uroImages.length >= 1) {
      this.setState({
        status: 'Uploading URO images',
      });
      for (const img of zipContents.uroImages) {
        await this.uploadImage(img, 'uro-images');
        this.incrProgress(this.progressWeight.uroImages / zipContents.uroImages.length);
      }
    } else {
      this.incrProgress(this.progressWeight.uroImages);
    }
    // Bot Icons
    if (zipContents.botIcons.length >= 1) {
      this.setState({
        status: 'Uploading Bot Icons',
      });
      for (const img of zipContents.botIcons) {
        await this.uploadImage(img, 'bot-icons');
        this.incrProgress(this.progressWeight.botIcons / zipContents.botIcons.length);
      }
    } else {
      this.incrProgress(this.progressWeight.botIcons);
    }

    this.setState({
      status: 'Import completed',
    });
  }

  handleJsonFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let status = '';
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

    const data = this.formatJsonData(json);

    await this.processJsonData(data);
    // No images on json file
    this.incrProgress(this.progressWeight.uroImages + this.progressWeight.botIcons);
    this.setState({
      status: 'Data upload complete',
    });
  }

  processJsonData = async (data: IAgentData) => {
    let status = '';
    try {
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
      const actions: IUtteranceAction[] = await this.uploadUtteranceActions(data.utteranceActions);
      const intentIdsMap = await this.uploadIntents(data.intents, actions);
      const tagTypeIdsMap = await this.uploadTagTypes(data.tagTypes);
      await this.uploadGraphPolicies(data.graphPolicies);
      const uros = await this.uploadOptions(data.userResponseOptions, intentIdsMap);

      await this.updateUtteranceActions(data.utteranceActions, actions, intentIdsMap, uros);

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
      this.addToErrors(`Errors in uploading examples`, JSON.stringify(err));
    }

    if (this.state.error.length === 0) {
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
        const createResult = await this.props.client?.mutate<ICreateGraphPolicyMutationResult>({
          mutation: createGraphPolicyMutation,
          variables: {
            agentId: this.props.agentId,
            policy: gpData,
          },
        });
        if(gp.isActive && createResult?.data?.ChatbotService_createGraphPolicy.id) {
          await this.props.client?.mutate({
            mutation: activateGraphPolicyMutation,
            variables: {
              agentId: this.props.agentId,
              id: createResult.data.ChatbotService_createGraphPolicy.id
            },
          });
        }
        this.incrProgress(this.progressWeight.graphPolicies / graphPolicies.length);
      } catch (e) {
        this.addToErrors(`Errors in uploading Graph Policies`, JSON.stringify(e));
      }
    }

    this.setState({
      status: 'Uploaded Graph Policies',
    });

  }

  render() {
    const state = this.state;
    const {classes} = this.props;

    const dialogContent = (
      <DialogContent>
        <DialogContentText>
          {state.status}
        </DialogContentText>
        <LinearProgress color="secondary" variant="determinate" value={state.progress} />

        {state.error.map((e, index) => {
          return (
          <Alert severity="error" key={index} className={classes.alert}>
            <Typography variant="subtitle1" color="error">{e.title}</Typography>
            {e.details}
          </Alert>
          );
        })}
      </DialogContent>
    );

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
          className={classes.uploadButton}
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
        <Button
          variant="contained"
          component="label"
          className={classes.uploadButton}
          style={{ padding: 6 }}>
          {'Upload Zip File'}
          <input
            name="zipfile"
            id="zipfile"
            accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
            type="file"
            style={{ display: 'none' }}
            multiple={false}
            onChange={this.handleZipFile}
          />
        </Button>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withApollo<IProps>(UploadDataDialog));

const UPLOAD_EXAMPLES = gql`
  mutation ($agentId: Int!, $examples: [ChatbotService_ExampleInput!]!) {
    ChatbotService_uploadExamples(agentId: $agentId, examples: $examples)
  }
`;
