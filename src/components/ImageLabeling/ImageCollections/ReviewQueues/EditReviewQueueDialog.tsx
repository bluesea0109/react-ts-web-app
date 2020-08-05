import { useMutation } from '@apollo/client';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { IReviewQueue } from '../../../../models/image-labeling-service';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
import IconButtonEdit from '../../../IconButtons/IconButtonEdit';
import { GET_REVIEW_QUEUES, UPDATE_REVIEW_QUEUE } from './gql-queries';

interface IEditReviewQueueDialogProps {
  queue: IReviewQueue;
}

function EditReviewQueueDialog(props: IEditReviewQueueDialogProps) {
  const { queue } = props;
  const [state, setState] = useState({
    open: false,
    name: queue.name,
  });
  const [updateQueue, updateQueueResult] = useMutation(UPDATE_REVIEW_QUEUE, {
    onCompleted: () => {
      handleClose();
    },
    refetchQueries: [{
      query: GET_REVIEW_QUEUES,
      variables: {
        collectionId: queue.collectionId,
      },
    }],
    awaitRefetchQueries: true,
  });

  const handleOpen = () => {
    setState({ ...state, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleSave = () => {
    updateQueue({
      variables: { queueId: queue.id, name: state.name },
    });
  };

  let dialogContent = (
    <DialogContent>
      <TextField
        value={state.name}
        onChange={handleChange('name')}
        autoFocus={true}
        margin="dense"
        id="name"
        label="Name"
        type="string"
        fullWidth={true}
      />
    </DialogContent>
  );

  if (updateQueueResult.loading) {
    dialogContent = (
      <DialogContent>
        <ContentLoading />
      </DialogContent>
    );
  }

  if (updateQueueResult.error) {
    dialogContent = (
      <DialogContent>
        <ApolloErrorPage error={updateQueueResult.error} />
      </DialogContent>
    );
  }

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        open={state.open}
        onClose={handleClose}
      >
        <DialogTitle>{'Edit Review Queue'}</DialogTitle>
        {dialogContent}
        <DialogActions>
          <Button color="primary" onClick={handleClose} disabled={updateQueueResult.loading}>
            {'Cancel'}
          </Button>
          <Button
            color="secondary"
            onClick={handleSave}
            disabled={state.name === '' || state.name === queue.name || updateQueueResult.loading}>
            {'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      <IconButtonEdit tooltip="Edit Queue" onClick={handleOpen} />
    </React.Fragment>
  );
}

export default EditReviewQueueDialog;
