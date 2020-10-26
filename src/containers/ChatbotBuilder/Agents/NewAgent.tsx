import { useMutation } from '@apollo/client';
import {
  Button,
  createStyles,
  Grid,
  LinearProgress,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import {
  CHATBOT_CREATE_AGENT,
  CHATBOT_GET_AGENTS,
} from '../../../common-gql-queries';
import { TextInput } from '../../../components';
import { IUser } from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import UploadDataDialog from '../UploadData/UploadDataDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    formHeading: {
      marginBottom: theme.spacing(2),
    },
    button: {
      marginBottom: theme.spacing(1),
      width: '100%',
    },
    inputBox: {
      marginBottom: theme.spacing(1),
      width: '100%',
      backgroundColor: theme.palette.background.default,
    },
  }),
);

interface INewAgentProps {
  user: IUser;
}

const NewAgent: React.FC<INewAgentProps> = ({ user }) => {
  const classes = useStyles();
  const [uname, setUname] = useState<string>('');
  const { enqueueSnackbar } = useSnackbar();

  const { projectId } = useParams();
  const [createAgent, { loading, error }] = useMutation(CHATBOT_CREATE_AGENT, {
    refetchQueries: [{ query: CHATBOT_GET_AGENTS, variables: { projectId } }],
    awaitRefetchQueries: true,
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: 'error' });
    },
  });

  if (error) {
    // TODO: handle errors
    return <ApolloErrorPage error={error} />;
  }

  const onUploadComplete = () => {
    setUname('');
  };

  const onSubmit = () => {
    if (!user.activeProject) {
      return;
    }
    createAgent({
      variables: {
        projectId,
        uname,
      },
    });

    setUname('');
  };

  return (
    <Grid className={classes.root}>
      <Grid xs={12} item={true}>
        <Typography variant="subtitle1" className={classes.formHeading}>
          Create New Assistant
        </Typography>
      </Grid>
      <Grid xs={12} md={4} item={true}>
        {loading && <LinearProgress />}
        <TextInput
          id="name"
          label="Unique Name"
          value={uname}
          onChange={(e: any) => setUname(e.target.value as string)}
        />
        <br />
        <Button
          className={clsx([classes.button])}
          variant="contained"
          color="primary"
          disabled={loading || !uname}
          onClick={onSubmit}>
          Create Without Data
        </Button>
        <UploadDataDialog
          uname={uname}
          projectId={projectId}
          buttonsDisabled={loading || !uname}
          onSuccess={onUploadComplete}
          onError={onUploadComplete}
          onCancel={onUploadComplete}
        />
      </Grid>
    </Grid>
  );
};

export default NewAgent;
