import { useMutation } from '@apollo/client';
import { Button } from '@bavard/react-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
import IconButtonDelete from '../../../IconButtons/IconButtonDelete';
import { DELETE_REVIEW_QUEUE, GET_REVIEW_QUEUES } from './gql-queries';

interface IDeleteReviewQueueProps {
  collectionId: number;
  queueId: number;
}

function DeleteReviewQueueDialog(props: IDeleteReviewQueueProps) {
  const { queueId, collectionId } = props;
  const [state, setState] = useState({
    open: false,
  });
  const [deleteQueue, deleteQueueResult] = useMutation(DELETE_REVIEW_QUEUE, {
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

  const handleDelete = () => {
    deleteQueue({
      variables: { queueId },
    });
  };

  if (deleteQueueResult.error) {
    return <ApolloErrorPage error={deleteQueueResult.error} />;
  }

  if (deleteQueueResult.loading) {
    return <ContentLoading />;
  }

  return (
    <React.Fragment>
      <Dialog fullWidth={true} open={state.open} onClose={handleClose}>
        <DialogTitle>{'Delete Review Queue'}</DialogTitle>
        <DialogActions>
          <Button
            title="Cancel"
            color="primary"
            onClick={handleClose}
            disabled={deleteQueueResult.loading}
          />
          <Button
            title="Delete"
            color="secondary"
            onClick={handleDelete}
            disabled={deleteQueueResult.loading}
          />
        </DialogActions>
      </Dialog>
      <IconButtonDelete tooltip="Delete Review Queue" onClick={handleOpen} />
    </React.Fragment>
  );
}

export default DeleteReviewQueueDialog;
