import { useMutation } from '@apollo/client';
import { TextInput, IconButton } from '@bavard/react-components';
import {
  Button,
  Box,
  createStyles,
  LinearProgress,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import { resetApolloContext } from '../../apollo-client';
import {
  CREATE_WORKSPACE,
  GET_CURRENT_USER,
  UPDATE_ACTIVE_WORKSPACE,
} from '../../common-gql-queries';
import ApolloErrorPage from '../ApolloErrorPage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    closeIcon: {
      top: 2,
      right: 2,
      position: 'absolute',
      cursor: 'pointer',
    },
  }),
);

interface INewWorkspaceProps {
  onCancel: () => void;
  onSuccess: () => void;
}

function NewWorkspace({ onCancel, onSuccess }: INewWorkspaceProps) {
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
      <CloseIcon className={classes.closeIcon} onClick={onCancel} />
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
