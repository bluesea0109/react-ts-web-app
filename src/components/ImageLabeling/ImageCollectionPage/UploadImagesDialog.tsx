import React, { useState, useEffect } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Tooltip from '@material-ui/core/Tooltip';
import gql from "graphql-tag";
import { useApolloClient } from '@apollo/react-hooks';
import _ from "lodash";
import { GraphQLError } from 'graphql';
import { Typography, Button } from '@material-ui/core';

interface IUploadImagesDialogProps {
  collectionId: number
}

export default function UploadImagesDialog(props: IUploadImagesDialogProps) {
  interface IState {
    open: boolean,
    cancelled: boolean,
    progress: number,
    numCompleted: number,
    total: number,
    error: GraphQLError | null,
    files: FileList | null
  }
  const [state, setState] = useState<IState>({
    open: false,
    cancelled: false,
    progress: 0.0,
    numCompleted: 0,
    total: 1,
    error: null,
    files: null,
  });
  const client = useApolloClient();

  useEffect(() => {

    const uploadChunk = async () => {
      if (!state.files || state.error) {
        return;
      }
      if (state.numCompleted === state.files.length || state.cancelled) {
        handleClose();
        return;
      }
      else if (state.numCompleted < state.files.length) {
        const chunk = _.slice(state.files, state.numCompleted, state.numCompleted + 4);
        try {
          await Promise.all(chunk.map(async file => {
            console.log('file', file);
            const res = await client.mutate({
              mutation: UPLOAD_IMAGE,
              variables: {
                collectionId: props.collectionId,
                file
              }
            });
          }));
        } catch (e) {
          setState({
            ...state,
            error: e,
          })
          return;
        }

        const numCompleted = state.numCompleted + chunk.length;
        setState({
          ...state,
          numCompleted,
          progress: numCompleted / state.files.length,
        });
      }
    }
    uploadChunk();
  }, [state.files, state.numCompleted])


  const handleClose = () => {
    setState({
      ...state,
      open: false,
      numCompleted: 0,
      total: 1,
    });
  };

  const cancel = () => {
    setState({
      ...state,
      cancelled: true
    })
  }

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setState({
      ...state,
      open: true,
      files,
    });
  };

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
    )
  }

  return (
    <React.Fragment>
      <Dialog
        open={state.open}
        onClose={handleClose}
        fullWidth={true}
      >
        <DialogTitle>{"Uploading Images"}</DialogTitle>
        {dialogContent}
        <DialogActions>
          <Button color="secondary" onClick={handleClose}>
            {"Cancel"}
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton component="label" style={{ padding: 6 }}>
        <Tooltip title="Upload Images" disableFocusListener={true}>
          <CloudUploadIcon color="secondary"></CloudUploadIcon>
        </Tooltip>
        <input
          name="image"
          id="image"
          accept="image/png, image/jpeg"
          type="file"
          style={{ display: "none" }}
          multiple
          onChange={handleFiles}
        />
      </IconButton>
    </React.Fragment>
  );
}

const UPLOAD_IMAGE = gql`
  mutation ($collectionId: Int!, $file: Upload!) {
    ImageLabelingService_uploadImage(collectionId: $collectionId, file: $file) {
      name
      collectionId
      digest
      size
    }
  }
`;
