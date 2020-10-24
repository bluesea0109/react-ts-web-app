import { useMutation } from '@apollo/client';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useState } from 'react';
import {
  CREATE_TRAINING_JOB,
  GET_TRAINING_JOBS,
} from '../../../common-gql-queries';
import ContentLoading from '../../ContentLoading';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      marginTop: theme.spacing(2),
    },
  }),
);

interface IProps {
  agentId: number;
  className?: string;
}

interface IState {
  open: boolean;
}

export default function CreateTrainingJobDialog(props: IProps) {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    open: false,
  });

  const [createTrainingJob, { error, loading }] = useMutation(
    CREATE_TRAINING_JOB,
    {
      refetchQueries: [
        { query: GET_TRAINING_JOBS, variables: { agentId: props.agentId } },
      ],
      awaitRefetchQueries: true,
    },
  );

  const handleOpen = () => {
    setState({ ...state, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  let dialogContent;
  const handleCreateTrainingJob = async () => {
    try {
      const responseData = await createTrainingJob({
        variables: {
          agentId: props.agentId,
        },
      });
      if (responseData) {
        handleClose();
      }
    } catch (e) {
      dialogContent = e.graphQLErrors[0].message;
    }
  };

  if (error) {
    dialogContent = (
      <React.Fragment>
        <DialogContent>{error.graphQLErrors[0].message} </DialogContent>
      </React.Fragment>
    );
  } else if (loading) {
    dialogContent = (
      <React.Fragment>
        <DialogContent>
          <ContentLoading />
        </DialogContent>
      </React.Fragment>
    );
  }
  return (
    <div className={clsx([classes.root, props.className])} color="inherit">
      <Dialog
        fullWidth={true}
        open={state.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Create Agent Training Jobs
        </DialogTitle>
        {dialogContent}
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            {'Cancel'}
          </Button>
          <Button
            color="secondary"
            onClick={handleCreateTrainingJob}
            disabled={loading || error != null}>
            {'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleOpen}>
        {'Train Agent'}
      </Button>
    </div>
  );
}
