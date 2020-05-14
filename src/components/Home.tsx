import { createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import 'firebase/auth';
import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../store/selectors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
    },
  }));

function Home() {
  const classes = useStyles();
  const user = useSelector(getCurrentUser);

  const userName = user.displayName;
  let welcomeMsg = `Welcome, back.`;

  if (userName) {
    const firstName = userName.split(' ')[0];
    welcomeMsg = `Welcome, ${firstName}`;
  }
  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} alignItems="center">
        <Typography variant="h6">{welcomeMsg}</Typography>
      </Grid>
    </Grid>
  );
}

export default Home;
