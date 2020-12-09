import { useMutation } from '@apollo/client';
import { TextInput, Button } from '@bavard/react-components';
import {
  Card,
  createStyles,
  LinearProgress,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import {
  CHATBOT_CREATE_UTTERANCE_ACTION,
  CHATBOT_GET_UTTERANCE_ACTIONS,
} from '../../../common-gql-queries';
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

const NewUtteranceAction: React.FC = () => {
  const classes = useStyles();
  const [text, setText] = useState<string>('');
  const [name, setName] = useState<string>('');
  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);
  const [createUtteranceAction, { loading, error }] = useMutation(
    CHATBOT_CREATE_UTTERANCE_ACTION,
    {
      refetchQueries: [
        { query: CHATBOT_GET_UTTERANCE_ACTIONS, variables: { agentId } },
      ],
      awaitRefetchQueries: true,
    },
  );

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  const onSubmit = () => {
    createUtteranceAction({
      variables: {
        agentId,
        name,
        text,
      },
    });
    setText('');
  };

  return (
    <Card className={clsx(classes.root)}>
      {loading && <LinearProgress />}
      <Typography variant="h4">New Utterance Action</Typography>
      <TextInput
        id="name"
        label="Action Name"
        labelType="Typography"
        labelPosition="top"
        type="text"
        value={text}
        variant="outlined"
        onChange={(e: any) => setText(e.target.value as string)}
        className={clsx(classes.inputBox)}
      />
      <TextInput
        id="value"
        label="Action Value"
        labelType="Typography"
        labelPosition="top"
        type="text"
        value={name}
        variant="outlined"
        onChange={(e: any) => setName(e.target.value as string)}
        className={clsx(classes.inputBox)}
      />
      <br />
      <Button
        title="Submit"
        className={clsx(classes.button)}
        variant="contained"
        color="primary"
        disabled={loading || !text}
        onClick={onSubmit}
      />
    </Card>
  );
};

export default NewUtteranceAction;
