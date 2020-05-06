import { Grid, Typography } from '@material-ui/core';
import 'firebase/auth';
import React from 'react';
import { useSelector } from "react-redux";
import { getCurrentUser } from "../store/selectors";

function Home() {
  const user = useSelector(getCurrentUser);

  const userName = user.displayName;
  let welcomeMsg = `Welcome, back.`;

  if (userName) {
    const firstName = userName.split(' ')[0];
    welcomeMsg = `Welcome, ${firstName}`;
  }
  return (
    <Grid container>
      <Grid item alignItems="center">
        <Typography variant="h6">{welcomeMsg}</Typography>
      </Grid>
    </Grid>
  );
};

export default Home;
