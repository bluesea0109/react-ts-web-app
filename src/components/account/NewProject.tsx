
import { Button, Card, createStyles, LinearProgress, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import clsx from "clsx";
import React, { useState } from "react";
import { CREATE_PROJECT } from '../../gql-queries';
import { useMutation, gql, useQuery } from '@apollo/client';

const GET_USER = gql`
  query {
    currentUser {
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
    }
  })
);

function NewProject() {
  const classes = useStyles();
  const [state, setState] = useState({
    name: ""
  });

  const getUser = useQuery(GET_USER);

  const [createProject, createProjectResult] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{
      query: GET_USER
    }]
  });

  const loading = getUser.loading || createProjectResult.loading;

  if (getUser.error) {
    // TODO: handle errors
    return <p>{JSON.stringify(getUser.error, null, 2)}</p>;
  }

  if (createProjectResult.error) {
    // TODO: handle errors
    return <p>{JSON.stringify(createProjectResult.error, null, 2)}</p>;
  }

  const submit = () => {
    if (!getUser.data.currentUser.activeOrg) {
      alert("User must have active org to create a project");
      return;
    }
    createProject({ variables: { orgId: getUser.data.currentUser.activeOrg.id, name: state.name } })
  }

  return (
    <Card className={clsx(classes.root)}>
      {loading && <LinearProgress />}
      <Typography variant="h4">{"New Project"}</Typography>
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
      <Button className={clsx(classes.button)} disabled={loading} variant="contained" color="primary" onClick={submit}>{"Submit"}</Button>
    </Card>
  )
}

export default NewProject;
