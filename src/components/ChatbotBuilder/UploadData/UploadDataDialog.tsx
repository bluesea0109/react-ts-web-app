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

  uploadSingle = async (file: File) => {
    // const res = await this.props.client.query({
    //   query: GET_UPLOAD_URL,
    //   variables: {
    //     agentId: this.ag
    //     filename: file.name,
    //   },
    // });

    // if (res.errors?.[0]) {
    //   console.error(res.errors[0]);
    //   this.setState({
    //     error: res.errors[0],
    //   });
    //   return;
    // }

    // const uploadUrl = res.data.ImageLabelingService_uploadUrl;

    // await axios.put(uploadUrl, file, {
    //   headers: {
    //     'Content-Type': 'application/octet-stream',
    //   },
    // });

    // this.setState((s) => ({
    //   progress: (s.numCompleted + 1) / s.total,
    //   numCompleted: s.numCompleted + 1,
    // }));
  }

  onCancel = () => {
    this.cancelled = true;
  }

  handleJsonFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) { return; }

    const file = files[0];

    this.setState({
      open: true,
      total: files.length,
    });

    const chunks = _.chunk(files, 3);
    for (const chunk of chunks) {
      if (this.cancelled || this.state.error) {
        break;
      }

      try {
        await Promise.all(chunk.map(file => {
          return this.uploadSingle(file);
        }));
      } catch (e) {
        console.error(e);
        this.setState({
          error: e,
        });
        return;
      }
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
          {`Uploaded ${state.numCompleted} out of ${state.total} images.`}
        </DialogContentText>
        <LinearProgress color="secondary" variant="determinate" value={state.progress * 100} />
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
          <DialogTitle>{'Uploading Images'}</DialogTitle>
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
          {"Upload JSON File"}
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

const GET_UPLOAD_URL = gql`
  query ($filename: String!, $collectionId: Int!) {
    ImageLabelingService_uploadUrl(filename: $filename, collectionId: $collectionId)
  }
`;
