import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  createStyles,
  LinearProgress,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import clsx from 'clsx';
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
    inputBox: {
      margin: theme.spacing(1),
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
);

interface INewWorkspaceProps {
  onSuccess?: () => void;
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
    onSuccess?.();
  };

  return (
    <Card className={clsx(classes.root)}>
      {(loading || activateResult.loading) && <LinearProgress />}
      <h4>{'New Workspace'}</h4>
      <br />
      <TextField
        id="name"
        label="Workspace Name"
        type="string"
        value={state.name || ''}
        variant="outlined"
        onChange={(e: any) => setState({ ...state, name: e.target.value })}
        className={clsx(classes.inputBox)}
      />
      <br />
      <Button
        className={clsx(classes.button)}
        disabled={loading || activateResult.loading || !state.name}
        variant="contained"
        color="primary"
        onClick={submit}>
        {'Submit'}
      </Button>
    </Card>
  );
}

export default NewWorkspace;
