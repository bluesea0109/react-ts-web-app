import { useMutation } from '@apollo/client';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
import IconButtonAdd from '../../../IconButtons/IconButtonAdd';
import { CREATE_REVIEW_QUEUE, GET_REVIEW_QUEUES } from './gql-queries';

function CreateReviewQueueDialog() {
  let { collectionId } = useParams();
  collectionId = parseInt(collectionId, 10);
  const [state, setState] = useState({
    open: false,
    name: '',
  });
  const [createQueue, createQueueResult] = useMutation(CREATE_REVIEW_QUEUE, {
    onCompleted: () => {
      handleClose();
    },
    refetchQueries: [{
      query: GET_REVIEW_QUEUES,
      variables: {
        collectionId,
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

  const handleCreate = () => {
    createQueue({
      variables: { collectionId, name: state.name },
    });
  };

  let dialogContent = (
    <DialogContent>
      <TextField
        autoFocus={true}
        margin="dense"
        id="name"
        label="Name"
        type="string"
        fullWidth={true}
        value={state.name}
        onChange={handleChange('name')}
      />
    </DialogContent>
  );

  if (createQueueResult.loading) {
    dialogContent = (
      <DialogContent>
        <ContentLoading />
      </DialogContent>
    );
  }

  if (createQueueResult.error) {
    dialogContent = (
      <DialogContent>
        <ApolloErrorPage error={createQueueResult.error} />
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
        <DialogTitle>{'Create Review Queue'}</DialogTitle>
        {dialogContent}
        <DialogActions>
          <Button color="primary" onClick={handleClose} disabled={createQueueResult.loading}>
            {'Cancel'}
          </Button>
          <Button color="secondary" onClick={handleCreate} disabled={state.name === '' || createQueueResult.loading}>
            {'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      <IconButtonAdd tooltip="Create Review Queue" onClick={handleOpen} />
    </React.Fragment>
  );
}

export default CreateReviewQueueDialog;
