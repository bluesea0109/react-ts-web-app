
import { gql, useMutation } from '@apollo/client';
import { Button, Card, createStyles, LinearProgress, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';
import { CREATE_PROJECT } from '../../gql-queries';
import { useMutation } from '@apollo/react-hooks';
import { useActiveOrg } from '../UseActiveOrg';
import gql from "graphql-tag";

const GET_USER = gql`
  query {
    currentUser {
      name,
      email,
      activeOrg {
        id,
        name
      }
      activeProject {
        id,
        name
      }
    }
  }
`;

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

function NewProject() {
  const classes = useStyles();
  const [state, setState] = useState({
    name: '',
  });
  const { orgId } = useActiveOrg();

  const [createProject, createProjectResult] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{
      query: GET_USER,
    }],
  });

  const loading = createProjectResult.loading;

  if (createProjectResult.error) {
    // TODO: handle errors
    return <p>{JSON.stringify(createProjectResult.error, null, 2)}</p>;
  }

  const submit = () => {
    if (!orgId) {
      alert('User must have active org to create a project');
      return;
    }
    createProject({ variables: { orgId, name: state.name } });
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
        onChange={(e: any) => setState({ ...state, name: (e.target.value) })}
        className={clsx(classes.inputBox)}
      />
      <br />
      <Button className={clsx(classes.button)} disabled={loading} variant="contained" color="primary" onClick={submit}>{'Submit'}</Button>
    </Card>
  );
}

export default NewProject;
