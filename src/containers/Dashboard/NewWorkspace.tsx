import { useMutation } from '@apollo/client';
import { TextInput } from '@bavard/react-components';
import {
  Button,
  Box,
  LinearProgress,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { resetApolloContext } from '../../apollo-client';
import {
  CREATE_WORKSPACE,
  GET_CURRENT_USER,
  UPDATE_ACTIVE_WORKSPACE,
} from '../../common-gql-queries';
import ApolloErrorPage from '../ApolloErrorPage';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  textInput: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

interface INewWorkspaceProps {
  onSuccess: () => void;
}

function NewWorkspace({ onSuccess }: INewWorkspaceProps) {
  const classes = useStyles();
  const [state, setState] = useState({
    name: '',
  });

  const [createWorkspace, { loading, error }] = useMutation(CREATE_WORKSPACE, {
    refetchQueries: [
      {
        query: GET_CURRENT_USER,
      },
    ],
    awaitRefetchQueries: true,
    onError: () => {},
  });

  const [activateWorkspace, activateResult] = useMutation(
    UPDATE_ACTIVE_WORKSPACE,
    {
      refetchQueries: [
        {
          query: GET_CURRENT_USER,
        },
      ],
      awaitRefetchQueries: true,
    },
  );

  if (error) {
    // TODO: handle errors
    return <ApolloErrorPage error={error} />;
  }

  const submit = async () => {
    const workspace = await createWorkspace({
      variables: { name: state.name },
    });
    // This should happen before activating, otherwise it fails
    resetApolloContext();

    if (!workspace || !workspace.data) return;

    const workspaceId = workspace.data.createWorkspace?.id;

    if (workspaceId) {
      await activateWorkspace({
        variables: {
          workspaceId,
        },
      });
    }

    setState({ name: '' });
    onSuccess();
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" p={8}>
      {(loading || activateResult.loading) && <LinearProgress />}
      <Typography variant="h6">Add a New Workspace</Typography>
      <TextInput
        label=""
        value={state.name || ''}
        fullWidth={true}
        className={classes.textInput}
        onChange={(e: any) => setState({ ...state, name: e.target.value })}
      />
      <Button
        color="primary"
        variant="contained"
        disabled={loading || activateResult.loading || !state.name}
        className={classes.button}
        onClick={submit}>
        {'Submit'}
      </Button>
    </Box>
  );
}

export default NewWorkspace;
