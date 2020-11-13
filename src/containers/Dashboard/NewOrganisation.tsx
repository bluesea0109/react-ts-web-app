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
  CREATE_ORG,
  GET_CURRENT_USER,
  UPDATE_ACTIVE_ORG,
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

interface INewOrgProps {
  onSuccess?: () => void;
}

function NewOrganisation({ onSuccess }: INewOrgProps) {
  const classes = useStyles();
  const [state, setState] = useState({
    name: '',
  });

  const [createOrg, { loading, error }] = useMutation(CREATE_ORG, {
    refetchQueries: [
      {
        query: GET_CURRENT_USER,
      },
    ],
    awaitRefetchQueries: true,
  });

  const [activateOrg, activateResult] = useMutation(UPDATE_ACTIVE_ORG, {
    refetchQueries: [
      {
        query: GET_CURRENT_USER,
      },
    ],
    awaitRefetchQueries: true,
  });

  if (error) {
    // TODO: handle errors
    return <ApolloErrorPage error={error} />;
  }

  const submit = async () => {
    const org = await createOrg({ variables: { name: state.name } });
    // This should happen before activating, otherwise it fails
    resetApolloContext();

    const orgId = org.data.createOrg?.id;

    if (orgId) {
      await activateOrg({
        variables: {
          orgId,
        },
      });
    }

    setState({ name: '' });
    onSuccess?.();
  };

  return (
    <Card className={clsx(classes.root)}>
      {(loading || activateResult.loading) && <LinearProgress />}
      <h4>{'New Organisation'}</h4>
      <br />
      <TextField
        id="name"
        label="Organisation Name"
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

export default NewOrganisation;
