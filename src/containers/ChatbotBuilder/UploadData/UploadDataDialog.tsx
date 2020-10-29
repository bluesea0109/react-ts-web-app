import { ApolloQueryResult } from '@apollo/client';
import { withApollo, WithApolloClient } from '@apollo/client/react/hoc';
import { IAgentConfig } from '@bavard/agent-config';
import { Button, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Theme, withStyles } from '@material-ui/core/styles';
import { CheckCircle, Error as ErrorIcon } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import gql from 'graphql-tag';
import _ from 'lodash';
import React from 'react';
import {
  CHATBOT_CREATE_AGENT,
  CHATBOT_GET_AGENT,
  CHATBOT_GET_AGENTS,
  CHATBOT_UPDATE_AGENT,
  CREATE_TRAINING_CONVERSATION,
} from '../../../common-gql-queries';

import { INLUExample, INLUExampleInput } from '../../../models/chatbot-service';
import { readAgentZipfile } from '../../../utils/archive';
import { uploadFileWithFetch } from '../../../utils/xhr';

import {
  botIconUploadQuery,
  updateBotSettingsMutation,
} from '../AgentSettings/gql';
import { IBotIconUploadUrlQueryResult } from '../AgentSettings/types';
import { getSignedImgUploadUrlQuery } from '../../../models/common-queries';
import { IGetImageUploadSignedUrlQueryResult } from '../../../models/common-service';

import {
  IAgentDataExport,
  ICreateAgentMutationResult,
  IGetAgentQueryResult,
  ITrainingConversation,
  ITrainingConversationMutationInput,
  IUpdateAgentMutationResult,
} from './types';

interface IUploadDataDialogProps {
  agentId?: number;
  projectId: string;
  uname?: string;
  name?: string;
  buttonsDisabled?: boolean;
  classes: {
    alert: string;
    uploadButton: string;
    linearProg: string;
  };
  onSuccess?: () => void;
  onError?: () => void;
  onCancel?: () => void;
}

type IProps = WithApolloClient<IUploadDataDialogProps>;

interface IError {
  title: string;
  details: string;
}

type stepStatus = 'queued' | 'importing' | 'completed' | 'error';
type stepName =
  | 'Create Agent'
  | 'Widget Config'
  | 'Examples'
  | 'URO Images'
  | 'Bot Icons'
  | 'Training Conversations';

interface IStep {
  name: string;
  status: stepStatus;
  progress: number;
}

interface IUploadDataDialogState {
  agentId: number | undefined;
  open: boolean;
  error: IError[];
  steps: IStep[];
  numCompleted: number;
}
const styles = (theme: Theme) => ({
  alert: {
    'word-break': 'break-word',
    margin: theme.spacing(1),
  },
  uploadButton: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  linearProg: {
    width: 190,
    marginTop: theme.spacing(1),
  },
});

class UploadDataDialog extends React.Component<IProps, IUploadDataDialogState> {
  totalSteps = 6;
  constructor(props: IProps) {
    super(props);

    this.state = {
      agentId: this.props.agentId,
      open: false,
      error: [],
      steps: [],
      numCompleted: 0,
    };
  }

  handleClose = () => {
    this.setState({
      open: false,
      error: [],
      steps: [],
      numCompleted: 0,
    });
  }

  addToErrors = (title: string, details: string) => {
    const errors = this.state.error;
    errors.push({ title, details });
    this.setState({ error: errors });
  }

  uploadBatch = async (examples: INLUExampleInput[]) => {
    this.setState((s) => ({
      ...s,
    }));

    const res = await this.props.client?.mutate({
      mutation: UPLOAD_EXAMPLES,
      variables: {
        agentId: this.state.agentId,
        examples,
        upsert: true,
      },
    });

    if (res?.errors?.[0]) {
      this.addToErrors(
        `Errors in uploading examples`,
        JSON.stringify(res.errors[0].message),
      );
      return;
    }
  }

  onCancel = () => {
    this.handleClose();
    this.props.onCancel?.();
  }

  formatJsonData = (json: string): IAgentDataExport => {
    const removeDuplicates = (exs: INLUExample[]) => {
      const seen = new Set<string>();
      const result: INLUExample[] = [];
      if (!exs) {
        exs = [];
      }
      exs.forEach((ex) => {
        if (seen.has(ex.intent + ex.text)) {
          return;
        }
        seen.add(ex.intent + ex.text);
        result.push(ex);
      });
      return result;
    };

    const data = JSON.parse(json) as IAgentDataExport;

    data.nluData.examples = removeDuplicates(data.nluData.examples);
    return data;
  }

  uploadTrainingConversations = async (
    trainingConversations: ITrainingConversation[],
  ) => {
    this.setStepStatus('Training Conversations', 'importing');

    if (trainingConversations.length === 0) {
      return this.setStepStatus('Training Conversations', 'completed');
    }

    let done = 0;
    try {
      if (!this.state.agentId) {
        throw new Error('Agent does not exist');
      }
      const length = trainingConversations.length;
      for (const tc of trainingConversations) {
        const tcInput: ITrainingConversationMutationInput = {
          agentId: this.state.agentId,
          ...tc,
        };
        const result = await this.props.client?.mutate({
          mutation: CREATE_TRAINING_CONVERSATION,
          variables: {
            conversation: tcInput,
          },
        });

        if (result?.errors) {
          throw new Error(JSON.stringify(result.errors));
        }
        done++;
        this.setStepStatus(
          'Training Conversations',
          'importing',
          done / length,
        );
      }
      this.setStepStatus('Training Conversations', 'completed');
    } catch (e) {
      this.setStepStatus('Training Conversations', 'error');
      this.addToErrors(
        'Error in uploading Training Conversations',
        JSON.stringify(e),
      );
    }
  }

  uploadSettings = async (settings: any) => {
    let uname = this.props.uname;
    if (_.isEmpty(settings)) {
      return this.setStepStatus('Widget Config', 'completed');
    }

    if (!uname) {
      const agentQueryResult = await this.props.client?.query<
        IGetAgentQueryResult
      >({
        query: CHATBOT_GET_AGENT,
        variables: {
          agentId: this.state.agentId,
        },
      });

      uname = agentQueryResult?.data?.ChatbotService_agent.uname;
    }

    if (!uname) {
      return this.addToErrors(
        'Could not update settings',
        'Agent uname was not found',
      );
    }

    this.setStepStatus('Widget Config', 'importing');

    try {
      const result = await this.props.client?.mutate({
        mutation: updateBotSettingsMutation,
        variables: {
          uname,
          settings,
        },
      });
      if (result?.errors) {
        throw new Error(JSON.stringify(result.errors));
      }

      this.setStepStatus('Widget Config', 'completed');
    } catch (e) {
      this.addToErrors('Error updating settings', JSON.stringify(e));
      this.setStepStatus('Widget Config', 'error');
    }
  }

  setStepStatus = (
    name: stepName,
    status: stepStatus,
    progress: number = 0,
  ) => {
    let steps = this.state.steps;
    let exists = false;

    if (status === 'completed') {
      progress = 100;
    }

    steps = steps.map((s) => {
      if (s.name === name) {
        s.status = status;
        s.progress = progress;
        exists = true;
      }
      return s;
    });

    if (!exists) {
      steps.push({
        name,
        status,
        progress,
      });
    }
    this.setState({ steps });
    this.checkCompletion(steps);
  }

  checkCompletion = (steps: IStep[]) => {
    let completeCount = 0;
    for (const step of this.state.steps) {
      if (step.status === 'completed') {
        completeCount++;
      }
    }

    this.setState({
      numCompleted: completeCount,
    });
  }

  uploadImage = async (imgFile: File, type: 'uro-images' | 'bot-icons') => {
    let url: string | undefined;

    if (type === 'uro-images') {
      const signedUrl:
        | ApolloQueryResult<IGetImageUploadSignedUrlQueryResult>
        | undefined = await this.props.client?.query({
        query: getSignedImgUploadUrlQuery,
        variables: {
          agentId: this.state.agentId,
          basename: imgFile.name,
        },
      });

      url = signedUrl?.data?.ChatbotService_imageOptionUploadUrl.url;
    } else if (type === 'bot-icons') {
      const signedUrl:
        | ApolloQueryResult<IBotIconUploadUrlQueryResult>
        | undefined = await this.props.client?.query({
        query: botIconUploadQuery,
        variables: {
          agentId: this.state.agentId,
          iconType: imgFile.name.toUpperCase(),
        },
      });

      url = signedUrl?.data?.ChatbotService_botIconUploadUrl.url;
    }

    if (!url) {
      this.addToErrors(
        `Error in uploading Image: ${imgFile.name}`,
        `Failed to get signed upload url`,
      );
      return;
    }

    try {
      await uploadFileWithFetch(imgFile, url, 'PUT');
    } catch (e) {
      this.addToErrors(
        `Error in uploading Image: ${imgFile.name}`,
        JSON.stringify(e),
      );
    }
  }

  ensureAgentExists = async (data: IAgentDataExport) => {
    // Returns a promise to await the state
    return new Promise(async (resolve) => {
      this.setStepStatus('Create Agent', 'importing');
      try {
        if (this.props.uname) {
          data.config.uname = this.props.uname;
          data.config.projectId = this.props.projectId;
        }

        const createAgentResult = await this.props.client?.mutate<
          ICreateAgentMutationResult
        >({
          mutation: CHATBOT_CREATE_AGENT,
          variables: {
            uname: this.props.uname || data.config.uname,
            projectId: this.props.projectId,
            language: 'EN_US',
            config: data.config,
          },
          refetchQueries: [
            {
              query: CHATBOT_GET_AGENTS,
              variables: {
                projectId: this.props.projectId,
              },
            },
          ],
          awaitRefetchQueries: false,
        });

        if (createAgentResult?.data?.ChatbotService_createAgent?.id) {
          this.setState(
            {
              agentId: createAgentResult.data.ChatbotService_createAgent.id,
            },
            () => {
              resolve();
            },
          );
          this.setStepStatus('Create Agent', 'completed');
        } else {
          throw new Error('Agent was not created');
        }
      } catch (e) {
        this.addToErrors('Error Creating Agent', JSON.stringify(e));
        this.setStepStatus('Create Agent', 'error');
        resolve();
      }
    });
  }

  updateAgentConfig = async (config: IAgentConfig) => {
    // Returns a promise to await the state

    this.setStepStatus('Create Agent', 'importing');
    try {
      if (this.props.uname) {
        config.uname = this.props.uname;
        config.projectId = this.props.projectId;
      }

      const updateAgentResult = await this.props.client?.mutate<
        IUpdateAgentMutationResult
      >({
        mutation: CHATBOT_UPDATE_AGENT,
        variables: {
          agentId: this.state.agentId,
          config,
        },
        refetchQueries: [
          {
            query: CHATBOT_GET_AGENTS,
            variables: {
              projectId: this.props.projectId,
            },
          },
        ],
        awaitRefetchQueries: false,
      });

      if (updateAgentResult?.errors?.length) {
        throw new Error(JSON.stringify(updateAgentResult));
      }

      this.setStepStatus('Create Agent', 'completed');
    } catch (e) {
      this.addToErrors('Error Creating Agent', JSON.stringify(e));
      this.setStepStatus('Create Agent', 'error');
    }
  }

  handleZipFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    const zipContents = await readAgentZipfile(file);
    // JSON config file
    if (zipContents.agentConfig) {
      const data = this.formatJsonData(zipContents.agentConfig);
      await this.processJsonData(data);
    }
    // URO Images
    if (zipContents.uroImages.length >= 1) {
      let fileNum = 1;
      this.setStepStatus('URO Images', 'importing');
      for (const img of zipContents.uroImages) {
        await this.uploadImage(img, 'uro-images');
        this.setStepStatus(
          'URO Images',
          'importing',
          Math.ceil((fileNum * 100) / zipContents.uroImages.length),
        );
        fileNum++;
      }
      this.setStepStatus('URO Images', 'completed');
    } else {
      this.setStepStatus('URO Images', 'completed');
    }
    // Bot Icons
    if (zipContents.botIcons.length >= 1) {
      this.setStepStatus('Bot Icons', 'importing');
      let fileNum = 1;
      for (const img of zipContents.botIcons) {
        await this.uploadImage(img, 'bot-icons');
        this.setStepStatus(
          'Bot Icons',
          'importing',
          Math.ceil((fileNum * 100) / zipContents.uroImages.length),
        );
        fileNum++;
      }
      this.setStepStatus('Bot Icons', 'completed');
    } else {
      this.setStepStatus('Bot Icons', 'completed');
    }

    if (this.state.error.length >= 1) {
      this.props.onError?.();
    } else {
      this.props.onSuccess?.();
    }
  }

  handleJsonFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

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

    this.setStepStatus('URO Images', 'completed');
    this.setStepStatus('Bot Icons', 'completed');

    if (this.state.error.length >= 1) {
      this.props.onError?.();
    } else {
      this.props.onSuccess?.();
    }
  }

  processJsonData = async (data: IAgentDataExport) => {
    this.setState({
      open: true,
    });

    if (!this.state.agentId) {
      await this.ensureAgentExists(data);
    } else {
      await this.updateAgentConfig(data.config);
    }

    this.uploadSettings(data.widgetSettings);
    this.uploadTrainingConversations(data.trainingConversations);

    try {
      const examples: INLUExampleInput[] = data.nluData?.examples || [];

      const exampleBatches = _.chunk(examples, 100);
      let batchNum = 1;
      this.setStepStatus('Examples', 'importing');
      for (const batch of exampleBatches) {
        await this.uploadBatch(batch);
        this.setStepStatus(
          'Examples',
          'importing',
          Math.ceil((batchNum * 100) / exampleBatches.length),
        );
        batchNum++;
      }

      this.setStepStatus('Examples', 'completed');
    } catch (err) {
      this.addToErrors(`Errors in uploading examples`, JSON.stringify(err));
      this.setStepStatus('Examples', 'error');
    }
  }

  renderStep = (s: IStep) => {
    const { classes } = this.props;
    return (
      <Alert
        variant="outlined"
        icon={
          s.status === 'completed' ? (
            <CheckCircle />
          ) : s.status === 'error' ? (
            <ErrorIcon />
          ) : (
            <CircularProgress color="secondary" size={20} />
          )
        }
        className={classes.alert}
        color={
          s.status === 'completed'
            ? 'success'
            : s.status === 'error'
            ? 'error'
            : 'info'
        }
        key={s.name}>
        <div>
          {s.status === 'importing' ? 'Importing... ' : ''} {s.name}
        </div>

        <div className={classes.linearProg}>
          {s.status === 'importing' ? (
            <LinearProgress
              variant="determinate"
              color="secondary"
              value={s.progress}
            />
          ) : (
            <div />
          )}
        </div>
      </Alert>
    );
  }

  render() {
    const state = this.state;
    const { classes } = this.props;
    const evenSteps = _.filter(state.steps, (s, index) => {
      return index % 2 === 0;
    });
    const oddSteps = _.filter(state.steps, (s, index) => {
      return index % 2 !== 0;
    });

    const dialogContent = (
      <DialogContent>
        <Typography variant="subtitle2">
          {state.numCompleted < this.totalSteps ? (
            <span>
              Step {state.numCompleted + 1} of {this.totalSteps}
            </span>
          ) : (
            'All steps executed'
          )}
        </Typography>
        <Grid container={true}>
          <Grid item={true} sm={12} md={6}>
            {evenSteps.map((s) => {
              return this.renderStep(s);
            })}
          </Grid>
          <Grid item={true} sm={12} md={6}>
            {oddSteps.map((s) => {
              return this.renderStep(s);
            })}
          </Grid>
        </Grid>

        {state.error.map((e, index) => {
          return (
            <Alert severity="error" key={index} className={classes.alert}>
              <Typography variant="subtitle1" color="error">
                {e.title}
              </Typography>
              {e.details}
            </Alert>
          );
        })}
      </DialogContent>
    );

    return (
      <React.Fragment>
        <Dialog open={state.open} onClose={this.handleClose} fullWidth={true}>
          <DialogTitle>{'Upload Agent Data'}</DialogTitle>
          {dialogContent}
          <DialogActions>
            {state.numCompleted === this.totalSteps ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleClose}>
                {'Close'}
              </Button>
            ) : (
              <Button
                color="secondary"
                onClick={this.onCancel}
                disabled={state.steps.length >= 1}>
                {'Cancel'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Button
          variant="contained"
          component="label"
          className={classes.uploadButton}
          disabled={this.props.buttonsDisabled}
          color="primary">
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
          disabled={this.props.buttonsDisabled}
          color="primary">
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
  mutation($agentId: Int!, $examples: [ChatbotService_ExampleInput!]!) {
    ChatbotService_uploadExamples(agentId: $agentId, examples: $examples)
  }
`;
