import { withApollo, WithApolloClient } from '@apollo/client/react/hoc';
import { Button } from '@bavard/react-components';
import { Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from 'axios';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import _ from 'lodash';
import React from 'react';

interface IUploadImagesDialogProps {
  collectionId: number;
}

type IProps = WithApolloClient<IUploadImagesDialogProps>;

interface IUploadImagesDialogState {
  open: boolean;
  progress: number;
  numCompleted: number;
  total: number;
  error: GraphQLError | null;
}

class UploadImagesDialog extends React.Component<
  IProps,
  IUploadImagesDialogState
> {
  constructor(props: IProps) {
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
  };

  uploadSingle = async (file: File) => {
    const res = await this.props.client?.query({
      query: GET_UPLOAD_URL,
      variables: {
        collectionId: this.props.collectionId,
        filename: file.name,
      },
    });

    if (res?.errors?.[0]) {
      console.error(res.errors[0]);
      this.setState({
        error: res.errors[0],
      });
      return;
    }

    const uploadUrl = res?.data.ImageLabelingService_uploadUrl;

    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    this.setState((s) => ({
      progress: (s.numCompleted + 1) / s.total,
      numCompleted: s.numCompleted + 1,
    }));
  };

  onCancel = () => {
    this.cancelled = true;
  };

  handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

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
        await Promise.all(
          chunk.map((file) => {
            return this.uploadSingle(file);
          }),
        );
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
  };

  render() {
    const state = this.state;

    let dialogContent = (
      <DialogContent>
        <DialogContentText>
          {`Uploaded ${state.numCompleted} out of ${state.total} images.`}
        </DialogContentText>
        <LinearProgress
          color="secondary"
          variant="determinate"
          value={state.progress * 100}
        />
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
        <Dialog open={state.open} onClose={this.handleClose} fullWidth={true}>
          <DialogTitle>{'Uploading Images'}</DialogTitle>
          {dialogContent}
          <DialogActions>
            <Button title="Cancel" color="secondary" onClick={this.onCancel} />
          </DialogActions>
        </Dialog>
        <IconButton component="label" style={{ padding: 6 }}>
          <Tooltip title="Upload Images" disableFocusListener={true}>
            <CloudUploadIcon color="secondary" />
          </Tooltip>
          <input
            name="image"
            id="image"
            accept="image/png, image/jpeg"
            type="file"
            style={{ display: 'none' }}
            multiple={true}
            onChange={this.handleFiles}
          />
        </IconButton>
      </React.Fragment>
    );
  }
}

export default withApollo<IUploadImagesDialogProps>(UploadImagesDialog);

const GET_UPLOAD_URL = gql`
  query($filename: String!, $collectionId: Int!) {
    ImageLabelingService_uploadUrl(
      filename: $filename
      collectionId: $collectionId
    )
  }
`;
