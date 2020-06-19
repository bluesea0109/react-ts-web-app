import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
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
}

interface IState {
  open: boolean;
}

export default function CreateTrainingJobDialog(props: IProps) {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    open: false,
  });

  const [createTrainingJob, { error, loading }] = useMutation(CREATE_TRAINING_JOB);

  const handleOpen = () => {
    setState({ ...state, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleCreateTrainingJob = async () => {
    createTrainingJob({
      variables: {
        agentId: props.agentId,
      },
    });
  };

  let dialogContent;

  if (error) {
    dialogContent = (
      <React.Fragment>
        <DialogContent/>
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
    <div className={classes.root} color="inherit">
      <Dialog
        fullWidth={true}
        open={state.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Agent Training Jobs</DialogTitle>
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
      <Button variant="contained" size="small" onClick={handleOpen}>
        {'Train Agent'}
      </Button>
    </div>
  );
}

const CREATE_TRAINING_JOB = gql`
  mutation ($agentId: Int!) {
    ChatbotService_createNLUTrainingJob(agentId: $agentId) {
      jobId
      status
    }
  }
`;
