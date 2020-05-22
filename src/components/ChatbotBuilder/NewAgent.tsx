import { useMutation } from '@apollo/react-hooks';
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
import { CHATBOT_CREATE_AGENT } from '../../gql-queries';
import { IUser } from '../../models';

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
  })
);

interface INewAgentProps {
  user: IUser;
}

const NewAgent: React.FC<INewAgentProps> = ({ user }) => {
  const classes = useStyles();
  const [name, setName] = useState<string>('');
  const [createAgent, { loading }] = useMutation(CHATBOT_CREATE_AGENT);

  const onSubmit = async () => {
    await createAgent({
      variables: {
        name,
        projectId: user.activeProject?.id,
        language: 'EN_US',
      },
    });
  };

  return (
    <Card className={clsx(classes.root)}>
      {loading && <LinearProgress />}
      <Typography variant="h4">New Agent</Typography>
      <br />
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
