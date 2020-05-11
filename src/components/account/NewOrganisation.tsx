
import { Button, Card, createStyles, LinearProgress, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import clsx from "clsx";
import React, { useState } from "react";
import { CREATE_ORG } from '../../gql-queries';
import { useMutation, gql } from '@apollo/client';

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

function NewOrganisation() {
  const classes = useStyles();
  const [state, setState] = useState({
    name: ""
  });
  const [createOrg, { loading, error }] = useMutation(CREATE_ORG, {
    refetchQueries: [{
      query: gql`
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
          orgs {
            id
            name
          }
        }`
      }]
  });

  if (error) {
    // TODO: handle errors
    return <p>{JSON.stringify(error, null, 2)}</p>;
  }

  const submit = () => {
    createOrg({ variables: { name: state.name } })
  }

  return (
    <Card className={clsx(classes.root)}>
      {loading && <LinearProgress />}
      <Typography variant="h4">{"New Organisation"}</Typography>
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
      <Button className={clsx(classes.button)} disabled={loading} variant="contained" color="primary" onClick={submit}>{"Submit"}</Button>
    </Card>
  )
}

export default NewOrganisation;
