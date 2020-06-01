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
import { useParams } from 'react-router';
<<<<<<< HEAD
import { CHATBOT_CREATE_INTENT, CHATBOT_GET_INTENTS } from '../../../common-gql-queries';
=======
import { CHATBOT_CREATE_INTENT, CHATBOT_GET_INTENTS } from '../../../gql-queries';
>>>>>>> 059037773fafdcf1186b35be1cc75427e78990bf
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

const NewIntent: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = useState<string>('');
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const [createIntent, { loading, error }] = useMutation(CHATBOT_CREATE_INTENT,  {
    refetchQueries: [{ query: CHATBOT_GET_INTENTS, variables: { agentId : numAgentId }  }],
    awaitRefetchQueries: true,
  });

  if (error) {
    // TODO: handle errors
    return <ApolloErrorPage error={error} />;
  }

  const onSubmit =  () => {
    createIntent({
      variables: {
        agentId: numAgentId ,
        value,
      },
    });
    setValue('');
  };

  return (
    <Card className={clsx(classes.root)}>
      {loading && <LinearProgress />}
      <Typography variant="h4">New Intent</Typography>
      <br />
      <TextField
        id="name"
        label="Intent Name"
        type="text"
        value={value}
        variant="outlined"
        onChange={(e: any) => setValue(e.target.value as string)}
        className={clsx(classes.inputBox)}
      />
      <br />
      <Button
        className={clsx(classes.button)}
        variant="contained"
        color="primary"
        disabled={loading || !value}
        onClick={onSubmit}>
        Submit
      </Button>
    </Card>
  );
};

export default NewIntent;
