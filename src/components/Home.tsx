import { Grid, Typography, makeStyles, createStyles, Theme } from '@material-ui/core';
import React from 'react';
import firebase from 'firebase';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2)
    },
  }));

function Home() {
  const classes = useStyles();
  const user = firebase.auth().currentUser;
  if (!user) {
    // this shouldn't happen
    console.error('No user signed in');
    return <Typography>{"No user is signed in."}</Typography>
  }

  const userName = user.displayName;
  let welcomeMsg = `Welcome, back.`;

  if (userName) {
    const firstName = userName.split(' ')[0];
    welcomeMsg = `Welcome, ${firstName}`;
  }
  return (
    <Grid container className={classes.root}>
      <Grid item alignItems="center">
        <Typography variant="h6">{welcomeMsg}</Typography>
      </Grid>
    </Grid>
  );
};

export default Home;
