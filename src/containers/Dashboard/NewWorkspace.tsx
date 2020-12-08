import { useMutation } from '@apollo/client';
import { TextInput, Button } from '@bavard/react-components';
import {
  Box,
  LinearProgress,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { resetApolloContext, getIdToken } from '../../apollo-client';
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
  const [error, setError] = useState<any>();

  const [
    createWorkspace,
    { loading, error: createWorkspaceError },
  ] = useMutation(CREATE_WORKSPACE, {
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

  const handleCloseErrorPage = () => {
    setError(null);
  };

  useEffect(() => {
    setError(createWorkspaceError);
  }, [createWorkspaceError]);

  if (error) {
    // TODO: handle errors
    return <ApolloErrorPage error={error} onClose={handleCloseErrorPage} />;
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

    localStorage.clear();
    sessionStorage.clear();
    getIdToken();
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
        title="Submit"
        color="primary"
        variant="contained"
        disabled={loading || activateResult.loading || !state.name}
        className={classes.button}
        onClick={submit}
      />
    </Box>
  );
}

export default NewWorkspace;
