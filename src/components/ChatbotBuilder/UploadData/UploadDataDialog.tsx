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
import { CHATBOT_CREATE_INTENTS, CHATBOT_CREATE_TAGS } from '../../../common-gql-queries';
import { IExampleInput } from '../../../models/chatbot-service';

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

    const removeDuplicates = (exs: IExampleInput[]) => {
      const seen = new Set<string>();
      const result: IExampleInput[] = [];
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

  uploadIntents = async (intents: string[]) => {
    this.setState({
      status: 'Creating intents',
    });

    const res = await this.props.client.mutate({
      mutation: CHATBOT_CREATE_INTENTS,
      variables: {
        agentId: this.props.agentId,
        values: intents,
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

  uploadTagTypes = async (tagTypes: string[]) => {
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

  handleJsonFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) { return; }

    const file = files[0];

    this.setState(s => ({
      ...s,
      open: true,
    }));

    if (file.type !== 'application/json') {
      // set error message
      this.setState(s => ({
        ...s,
        status: 'Invalid file type',
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

    await this.uploadIntents(data.intents);
    await this.uploadTagTypes(data.tagTypes);

    const exampleBatches = _.chunk(data.examples, 100);

    for (const batch of exampleBatches) {
      await this.uploadBatch(batch);
      numCompleted += batch.length;
      const progress = 100.0 * numCompleted / total;
      this.setState({
        status: 'Uploading examples',
        numCompleted,
        total,
        progress,
      });
    }

    if (!this.state.error) {
      this.handleClose();
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
      dialogContent = (
        <DialogContent>
          <Typography>{state.error.message}</Typography>
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
          <DialogTitle>{'Uploading Examples File'}</DialogTitle>
          {dialogContent}
          <DialogActions>
            <Button color="secondary" onClick={this.onCancel}>
              {'Cancel'}
            </Button>
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

interface IAgentData {
  intents: string[];
  tagTypes: string[];
  examples: IExampleInput[];
}
