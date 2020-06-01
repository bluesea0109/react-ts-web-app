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
import { CHATBOT_CREATE_TEMPLATE, CHATBOT_GET_TEMPLATES } from '../../../common-gql-queries';
=======
import { CHATBOT_CREATE_TEMPLATE, CHATBOT_GET_TEMPLATES } from '../../../gql-queries';
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

const NewTemplate: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = useState<string>('');
  const [name, setName] = useState<string>('');
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const [createTemplate, { loading, error }] = useMutation(CHATBOT_CREATE_TEMPLATE,  {
    refetchQueries: [{ query: CHATBOT_GET_TEMPLATES, variables: { agentId : numAgentId }  }],
    awaitRefetchQueries: true,
  });

  if (error) {
    // TODO: handle errors
    return <ApolloErrorPage error={error} />;
  }

  const onSubmit =  () => {
    createTemplate({
      variables: {
        agentId: numAgentId ,
        name,
        value,
      },
    });
    setValue('');
  };

  return (
    <Card className={clsx(classes.root)}>
      {loading && <LinearProgress />}
      <Typography variant="h4">New Template</Typography>
      <br />
      <TextField
        id="name"
        label="Template Name"
        type="text"
        value={value}
        variant="outlined"
        onChange={(e: any) => setValue(e.target.value as string)}
        className={clsx(classes.inputBox)}
      />
      <br />
      <TextField
        id="value"
        label="Template Value"
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
        disabled={loading || !value}
        onClick={onSubmit}>
        Submit
      </Button>
    </Card>
  );
};

export default NewTemplate;
