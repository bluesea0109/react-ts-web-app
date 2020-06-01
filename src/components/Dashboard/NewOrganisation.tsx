import { useMutation } from '@apollo/react-hooks';
import { Button, Card, createStyles, LinearProgress, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';
import { CREATE_ORG, GET_CURRENT_USER } from '../../common-gql-queries';
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

function NewOrganisation() {
  const classes = useStyles();
  const [state, setState] = useState({
    name: '',
  });

  const [createOrg, { loading, error }] = useMutation(CREATE_ORG, {
    refetchQueries: [{
      query: GET_CURRENT_USER,
    }],
    awaitRefetchQueries: true,
  });

  if (error) {
    // TODO: handle errors
    return <ApolloErrorPage error={error}/>;
  }

  const submit = () => {
    createOrg({ variables: { name: state.name } });
    setState({ name: ''});
  };

  return (
    <Card className={clsx(classes.root)}>
      {loading && <LinearProgress />}
      <Typography variant="h4">{'New Organisation'}</Typography>
      <br />
      <TextField
        id="name"
        label="Organisation Name"
        type="string"
        value={state.name || ''}
        variant="outlined"
        onChange={(e: any) => setState({ ...state, name: (e.target.value) })}
        className={clsx(classes.inputBox)}
      />
      <br />
      <Button className={clsx(classes.button)} disabled={loading || !state.name} variant="contained" color="primary" onClick={submit}>{'Submit'}</Button>
    </Card>
  );
}

export default NewOrganisation;
