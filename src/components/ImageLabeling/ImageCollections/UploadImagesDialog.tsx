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
import axios from "axios";

// eslint-disable-next-line import/no-webpack-loader-syntax
// import Worker from 'worker-loader!./worker';

interface IUploadImagesDialogProps {
  collectionId: number
}

export default function UploadImagesDialog(props: IUploadImagesDialogProps) {
  let cancelled = false;

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
  console.log('test');
  useEffect(() => {
    if (state.files) {
      // const uploadFiles = async () => {
      //   if (!state.files) return;
      //   console.log('uploading files');
      //   let numCompleted = 0;
      //   const uploadWorker = await spawn<UploadWorker>(new TWorker("./upload-worker.ts", { type: 'module' }));
      //   const worker = uploadWorker(props.collectionId, client, state.files);
      //   worker.subscribe((uploadCount: unknown) => {
      //     numCompleted += uploadCount as number;
      //     setState(s => ({
      //       ...s,
      //       numCompleted,
      //     }));
      //   });
      //   await worker;
      // }

      // uploadFiles();

      console.log('starting worker');
      // const worker = new Worker()
      // worker.postMessage('test');
    }
  }, [state.files])


  const handleClose = () => {
    setState({
      ...state,
      open: false,
      numCompleted: 0,
      total: 1,
    });
  };

  const uploadSingle = async (file: File) => {
    const res = await client.query({
      query: GET_UPLOAD_URL,
      variables: {
        collectionId: props.collectionId,
        filename: file.name,
      }
    });

    if (res.errors?.[0]) {
      cancelled = true;
      console.error(res.errors[0]);
      setState(s => ({
        ...s,
        error: res.errors?.[0] ?? null
      }));
      return;
    }

    const uploadUrl = res.data.ImageLabelingService_uploadUrl;

    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });

    setState(s => ({
      ...s,
      progress: (s.numCompleted + 1) / s.total,
      numCompleted: s.numCompleted + 1
    }));
  }

  const onCancel = () => {
    setState(s => ({
      ...s,
      cancelled: true
    }));
  }

  console.log('test');

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('test');

    const files = e.target.files;
    if (!files) return;

    console.log('setting files');
    setState({
      ...state,
      open: true,
      total: files.length,
      files,
    })

    // const chunks = _.chunk(files, 3);
    // for (const chunk of chunks) {
    //   if (state.cancelled) {
    //     break;
    //   }

    //   try {
    //     await Promise.all(chunk.map(file => {
    //       return uploadSingle(file);
    //     }));
    //   } catch (e) {
    //     console.error(e);
    //     cancelled = true;
    //     setState(s => ({
    //       ...s,
    //       error: e
    //     }));
    //     return;
    //   }
    // }

    // if (!state.error) {
    //   handleClose();
    // }
  }

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
          <Button color="secondary" onClick={onCancel}>
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

const GET_UPLOAD_URL = gql`
  query ($filename: String!, $collectionId: Int!) {
    ImageLabelingService_uploadUrl(filename: $filename, collectionId: $collectionId)
  }
`;
