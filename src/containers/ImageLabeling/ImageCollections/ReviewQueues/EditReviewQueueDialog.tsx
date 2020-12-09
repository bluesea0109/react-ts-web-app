import { useMutation } from '@apollo/client';
import { TextInput, Button } from '@bavard/react-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
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
    refetchQueries: [
      {
        query: GET_REVIEW_QUEUES,
        variables: {
          collectionId: queue.collectionId,
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

  const handleSave = () => {
    updateQueue({
      variables: { queueId: queue.id, name: state.name },
    });
  };

  if (updateQueueResult.error) {
    return <ApolloErrorPage error={updateQueueResult.error} />;
  }

  if (updateQueueResult.loading) {
    return <ContentLoading />;
  }

  return (
    <React.Fragment>
      <Dialog fullWidth={true} open={state.open} onClose={handleClose}>
        <DialogTitle>{'Edit Review Queue'}</DialogTitle>
        <DialogContent>
          <TextInput
            id="name"
            label="Name"
            labelType="Typography"
            labelPosition="top"
            type="string"
            value={state.name}
            margin="dense"
            autoFocus={true}
            fullWidth={true}
            onChange={handleChange('name')}
          />
        </DialogContent>
        <DialogActions>
          <Button
            title="Cancel"
            color="primary"
            onClick={handleClose}
            disabled={updateQueueResult.loading}
          />
          <Button
            title="Save"
            color="secondary"
            onClick={handleSave}
            disabled={
              state.name === '' ||
              state.name === queue.name ||
              updateQueueResult.loading
            }
          />
        </DialogActions>
      </Dialog>
      <IconButtonEdit tooltip="Edit Queue" onClick={handleOpen} />
    </React.Fragment>
  );
}

export default EditReviewQueueDialog;
