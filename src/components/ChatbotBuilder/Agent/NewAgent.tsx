import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  createStyles,
  LinearProgress,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { CHATBOT_CREATE_AGENT, CHATBOT_GET_AGENTS } from '../../../common-gql-queries';
import { IUser } from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    inputBox: {
      margin: theme.spacing(1),
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
);

interface INewAgentProps {
  user: IUser;
}

const NewAgent: React.FC<INewAgentProps> = ({ user }) => {
  const classes = useStyles();
  const [name, setName] = useState<string>('');
  const [uname, setUname] = useState<string>('');

  const { projectId } = useParams();
  const [createAgent, { loading, error }] = useMutation(CHATBOT_CREATE_AGENT,  {
    refetchQueries: [{ query: CHATBOT_GET_AGENTS, variables: { projectId }  }],
    awaitRefetchQueries: true,
    onError: () => { },
    errorPolicy: 'ignore',
  });

  if (error) {
    // TODO: handle errors
    return <ApolloErrorPage error={error} />;
  }

  const onSubmit =  () => {
    if (!user.activeProject) { return; }
    createAgent({
      variables: {
        projectId,
        uname,
        name,
        language: 'EN_US',
      },
    });
    setName('');
  };

  return (
    <Card className={clsx(classes.root)}>
      {loading && <LinearProgress />}
      <Typography variant="h4">New Agent</Typography>
      <br />
      <TextField
        id="name"
        label="Agent Unique Name"
        type="text"
        value={uname}
        variant="outlined"
        onChange={(e: any) => setUname(e.target.value as string)}
        className={clsx(classes.inputBox)}
      />
      <TextField
        id="name"
        label="Agent Name"
        type="text"
        value={name}
        variant="outlined"
        onChange={(e: any) => setName(e.target.value as string)}
        className={clsx(classes.inputBox)}
      />
      <br />
      <Button
        className={clsx(classes.button)}
        variant="contained"
        color="primary"
        disabled={loading || !name}
        onClick={onSubmit}>
        Submit
      </Button>
    </Card>
  );
};

export default NewAgent;
