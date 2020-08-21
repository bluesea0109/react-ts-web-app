import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
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
import UploadDataDialog from '../UploadData/UploadDataDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputBox: {
      margin: theme.spacing(1),
    },
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
    setUname('');
  };

  const onUploadComplete = () => {
    setName('');
    setUname('');
  };

  return (
    <Card className={classes.formCard}>
      <CardHeader title={<Typography variant="h6">Create New Agent</Typography>}/>
      <CardContent>
        {loading && <LinearProgress />}
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
      </CardContent>
      <CardActionArea>
        <CardContent>
          <Button
            className={clsx(classes.button)}
            variant="contained"
            color="primary"
            disabled={loading || !name}
            onClick={onSubmit}>
            Create Without Data
          </Button>
          {
            (uname.length >= 1 && name.length >= 1) &&
            <UploadDataDialog projectId={projectId} uname={uname} name={name}
              buttonsDisabled={loading || !uname || !name} onSuccess={onUploadComplete}
              onError={onUploadComplete}
              onCancel={onUploadComplete}
            />
          }
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default NewAgent;
