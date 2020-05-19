import { useMutation } from '@apollo/react-hooks';
import { Button, Card, createStyles, LinearProgress, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';
import { CREATE_PROJECT, GET_CURRENT_USER } from '../../gql-queries';
import { IOrg } from '../../models';
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

interface INewProjectProps {
  activeOrg: IOrg | null;
}

function NewProject(props: INewProjectProps) {
  const { activeOrg } = props;
  const classes = useStyles();
  const [state, setState] = useState({
    name: '',
  });

  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{
      query: GET_CURRENT_USER,
    }],
    awaitRefetchQueries: true,
  });

  if (error) {
    // TODO: handle errors
    return <ApolloErrorPage error={error} />;
  }

  const submit = () => {
    if (!activeOrg) { return; }
    createProject({ variables: { orgId: activeOrg.id, name: state.name } });
    setState({ name: '' });
  };

  return (
    <Card className={clsx(classes.root)}>
      {loading && <LinearProgress />}
      <Typography variant="h4">{'New Project'}</Typography>
      <br />
      <TextField
        id="name"
        label="Project Name"
        type="string"
        value={state.name || ''}
        variant="outlined"
        onChange={(e: any) => setState({ ...state, name: e.target.value })}
        className={clsx(classes.inputBox)}
      />
      <br />
      <Button
        className={clsx(classes.button)}
        variant="contained" color="primary"
        disabled={loading || activeOrg == null || !state.name}
        onClick={submit}>
        {'Submit'}
      </Button>
    </Card>
  );
}

export default NewProject;
