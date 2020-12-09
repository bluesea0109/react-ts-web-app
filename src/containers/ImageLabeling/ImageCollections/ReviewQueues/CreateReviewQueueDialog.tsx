import { useMutation } from '@apollo/client';
import { TextInput, Button } from '@bavard/react-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
import IconButtonAdd from '../../../IconButtons/IconButtonAdd';
import { CREATE_REVIEW_QUEUE, GET_REVIEW_QUEUES } from './gql-queries';

function CreateReviewQueueDialog() {
  const params = useParams<{
    collectionId: string;
  }>();
  const collectionId = parseInt(params.collectionId, 10);
  const [state, setState] = useState({
    open: false,
    name: '',
  });
  const [createQueue, createQueueResult] = useMutation(CREATE_REVIEW_QUEUE, {
    onCompleted: () => {
      handleClose();
    },
    refetchQueries: [
      {
        query: GET_REVIEW_QUEUES,
        variables: {
          collectionId,
        },
      },
    ],
    awaitRefetchQueries: true,
  });

  const handleOpen = () => {
    setState({ ...state, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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

  if (createQueueResult.error) {
    return <ApolloErrorPage error={createQueueResult.error} />;
  }

  if (createQueueResult.loading) {
    return <ContentLoading />;
  }

  return (
    <React.Fragment>
      <Dialog fullWidth={true} open={state.open} onClose={handleClose}>
        <DialogTitle>{'Create Review Queue'}</DialogTitle>
        <DialogContent>
          <TextInput
            id="name"
            label="Name"
            labelType="Typography"
            labelPosition="top"
            type="string"
            margin="dense"
            autoFocus={true}
            value={state.name}
            fullWidth={true}
            onChange={handleChange('name')}
          />
        </DialogContent>
        <DialogActions>
          <Button
            title="Cancel"
            color="primary"
            onClick={handleClose}
            disabled={createQueueResult.loading}
          />
          <Button
            title="Save"
            color="secondary"
            onClick={handleCreate}
            disabled={state.name === '' || createQueueResult.loading}
          />
        </DialogActions>
      </Dialog>
      <IconButtonAdd tooltip="Create Review Queue" onClick={handleOpen} />
    </React.Fragment>
  );
}

export default CreateReviewQueueDialog;
