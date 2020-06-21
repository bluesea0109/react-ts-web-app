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
  TextareaAutosize,
} from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { CHATBOT_CREATE_INTENTS, CHATBOT_GET_INTENTS } from '../../../common-gql-queries';
import ApolloErrorPage from '../../ApolloErrorPage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    inputBox: {
      margin: theme.spacing(1),
    },
    textAreaBox: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
);

const NewIntent: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = useState<string>('');
  const [defaultResponse, setDefaultResponse] = useState<string>('');
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const [createIntents, { loading, error }] = useMutation(CHATBOT_CREATE_INTENTS,  {
    refetchQueries: [{ query: CHATBOT_GET_INTENTS, variables: { agentId : numAgentId }  }],
    awaitRefetchQueries: true,
  });

  if (error) {
    // TODO: handle errors
    return <ApolloErrorPage error={error} />;
  }

  const onSubmit =  () => {
    createIntents({
      variables: {
        agentId: numAgentId ,
        intents: [{value:value, defaultResponse:defaultResponse}],
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
      <TextareaAutosize aria-label="minimum height" className={clsx(classes.textAreaBox)}  value={defaultResponse} onChange={(e: any) => setDefaultResponse(e.target.value as string)} rowsMin={4} placeholder="Intent Default Response" />
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
