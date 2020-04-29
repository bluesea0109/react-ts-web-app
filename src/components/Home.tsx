import React from 'react';
import 'firebase/auth';
import { useSelector } from "react-redux";
import { getCurrentUser } from "../store/selectors"
import { Grid, makeStyles, Theme, createStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  }));

export default function Home(props: any) {
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
