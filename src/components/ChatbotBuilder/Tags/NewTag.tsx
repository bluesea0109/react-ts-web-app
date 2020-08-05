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
import { CHATBOT_CREATE_TAGS, CHATBOT_GET_TAGS } from '../../../common-gql-queries';
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

const NewTag: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = useState<string>('');
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const [createTags, { loading, error }] = useMutation(CHATBOT_CREATE_TAGS,  {
    refetchQueries: [{ query: CHATBOT_GET_TAGS, variables: { agentId : numAgentId }  }],
    awaitRefetchQueries: true,
  });

  if (error) {
    // TODO: handle errors
    return <ApolloErrorPage error={error} />;
  }

  const onSubmit =  () => {
    createTags({
      variables: {
        agentId: numAgentId ,
        values: [value],
      },
    });
    setValue('');
  };

  return (
    <Card className={clsx(classes.root)}>
      {loading && <LinearProgress />}
      <Typography variant="h4">New Tag</Typography>
      <br />
      <TextField
        id="name"
        label="Tag Name"
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

export default NewTag;
