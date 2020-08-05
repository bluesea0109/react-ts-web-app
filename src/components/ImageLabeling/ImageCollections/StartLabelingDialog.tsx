import { useMutation } from '@apollo/client';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import IconButtonPlay from '../../IconButtons/IconButtonPlay';

interface IStartLabelingDialogState {
  open: boolean;
  error: GraphQLError | null;
  mode: string;
  batchSize: number;
}

function StartLabelingDialog() {
  const { orgId, projectId, collectionId } = useParams();
  const [state, setState] = useState<IStartLabelingDialogState>({
    open: false,
    error: null,
    mode: 'single',
    batchSize: 15,
  });
  const [nextImage, nextImageResult] = useMutation(NEXT_LABEL_QUEUE_IMAGE);
  const history = useHistory();

  const handleOpen = () => {
    setState({
      ...state,
      open: true,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setState({ ...state, mode: value });
  };

  const handleChangeBatchSize = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let batchSize = parseInt(event.target.value, 10);
    batchSize = Math.min(batchSize, 50);
    batchSize = Math.max(batchSize, 1);
    setState({ ...state, batchSize });
  };

  const beginDisabled = () => {
    if (state.mode === 'single') {
      return false;
    }

    if (state.batchSize < 1 || state.batchSize > 50) {
      return true;
    }
  };

  const beginLabeling = async () => {
    if (state.mode === 'single') {
      const res = await nextImage({
        variables: {
          collectionId: parseInt(collectionId, 10),
        },
      });

      if (res.data?.ImageLabelingService_nextLabelQueueImage) {
        const { imageId } = res.data.ImageLabelingService_nextLabelQueueImage;
        history.push({
          pathname: `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/label-image/${imageId}`,
        });
      }
    } else {
      history.push({
        pathname: `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/batch-labeling/label-batch`,
        search: `?batchSize=${state.batchSize}`,
      });
    }
  };

  let dialogContent = (
    <DialogContent>
      <FormControl component="fieldset">
        <FormLabel component="legend">{'Mode'}</FormLabel>
        <RadioGroup aria-label="mode" name="gender1" value={state.mode} onChange={handleChange}>
          <FormControlLabel value="single" control={<Radio />} label="Single - label one image at a time" />
          <FormControlLabel value="batch" control={<Radio />} label="Batch - label batches of images (supports category labeling only)" />
          <FormControl component="fieldset">
            <TextField
              disabled={state.mode !== 'batch'}
              onChange={handleChangeBatchSize}
              value={state.batchSize}
              id="standard-number"
              label="Batch Size"
              type="number"
              size="small"
            />
          </FormControl>
        </RadioGroup>
      </FormControl>
    </DialogContent>
  );

  if (nextImageResult.error) {
    dialogContent = (
      <DialogContent>
        <ApolloErrorPage error={nextImageResult.error}/>
      </DialogContent>
    );
  }

  if (nextImageResult.loading) {
    dialogContent = (
      <DialogContent>
        <ContentLoading />
      </DialogContent>
    );
  }

  return (
    <React.Fragment>
      <Dialog
        open={state.open}
        onClose={handleClose}
        fullWidth={true}
      >
        <DialogTitle>{'Start Labeling Images'}</DialogTitle>
        {dialogContent}
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            {'Cancel'}
          </Button>
          <Button color="secondary" onClick={beginLabeling} disabled={beginDisabled()}>
            {'Begin'}
          </Button>
        </DialogActions>
      </Dialog>
      <IconButtonPlay tooltip="Start Labeling" onClick={handleOpen} />
    </React.Fragment>
  );
}

export default StartLabelingDialog;

const NEXT_LABEL_QUEUE_IMAGE = gql`
  mutation($collectionId: Int!) {
    ImageLabelingService_nextLabelQueueImage(collectionId: $collectionId) {
      imageId
    }
  }
`;
