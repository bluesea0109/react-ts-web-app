import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  createStyles,
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
    button: {
      margin: theme.spacing(1),
    },
    formCard: {
      backgroundColor: theme.palette.background.default,
      minHeight: 250,
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
    <Card className={classes.formCard}>
      <CardHeader
        title={<Typography variant="h6">Create New Agent</Typography>}
      />
      <CardContent>
        {loading && <LinearProgress />}
        <TextInput
          id="name"
          label="Agent Unique Name"
          value={uname}
          variant="outlined"
          onChange={(name) => setUname(name)}
        />
        <br />
      </CardContent>
      <CardContent>
        <Button
          className={clsx(classes.button)}
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
      </CardContent>
    </Card>
  );
};

export default NewAgent;
