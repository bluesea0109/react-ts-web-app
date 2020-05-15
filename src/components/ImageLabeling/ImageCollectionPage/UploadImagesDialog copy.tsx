import React, { useState } from 'react';
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
  let cancelled = false;

  interface IState {
    open: boolean,
    progress: number,
    numCompleted: number,
    total: number,
    error: GraphQLError | null,
    files: FileList | null
  }
  const [state, setState] = useState<IState>({
    open: false,
    progress: 0.0,
    numCompleted: 0,
    total: 1,
    error: null,
    files: null,
  });

  const client = useApolloClient();

  const handleClose = () => {
    setState({
      ...state,
      open: false,
      numCompleted: 0,
      total: 1,
    });
  };

  const uploadSingle = async (file: any) => {
    const res = await client.mutate({
      mutation: UPLOAD_IMAGE,
      variables: {
        collectionId: props.collectionId,
        file
      }
    });

    if (res.errors) {
      cancelled = true;
      console.error(res.errors[0]);
      setState({
        ...state,
        error: res.errors[0]
      })
    }
    else {
      setState((state) => {
        return {
          ...state,
          progress: (state.numCompleted + 1) / state.total,
          numCompleted: state.numCompleted + 1
        };
      });
    }
  }

  const cancel = () => {
    cancelled = true;
  }

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setState({
      ...state,
      files,
    })
    const total = files.length;

    const chunks = _.chunk(files, 4);
    for (const chunk of chunks) {
      if (cancelled) {
        break;
      }

      try {
        await Promise.all(chunk.map(file => {
          return uploadSingle(file);
        }));
      } catch (e) {
        console.error(e);
        cancelled = true;
        setState({
          ...state,
          error: e
        })
        break;
      }
    }

    setState({
      ...state,
      total,
      open: true,
      files,
    });

    if (!cancelled && !state.error) {
      //handleClose();
    }
  };

  const uploadFiles = async () => {
    if (state.open && state.files) {
      const files = state.files;
      const chunks = _.chunk(files, 4);
      for (const chunk of chunks) {
        if (cancelled) {
          break;
        }
  
        try {
          await Promise.all(chunk.map(file => {
            return uploadSingle(file);
          }));
        } catch (e) {
          console.error(e);
          cancelled = true;
          setState({
            ...state,
            error: e
          })
          break;
        }
      }
    }
  }

  uploadFiles();

  let dialogContent = (
    <DialogContent>
      <DialogContentText>
        {`Uploaded ${state.numCompleted} out of ${state.total} images.`}
      </DialogContentText>
      <LinearProgress color="secondary" variant="determinate" value={state.progress * 100} />
    </DialogContent>
  );

  // if (state.error) {
  //   dialogContent = (
  //     <DialogContent>
  //       <Typography>{state.error.message}</Typography>
  //     </DialogContent>
  //   )
  // }
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
          <Button color="secondary" onClick={cancel}>
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
