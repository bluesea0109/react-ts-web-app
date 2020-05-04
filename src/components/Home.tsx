import { Grid, Typography } from '@material-ui/core';
import 'firebase/auth';
import React from 'react';
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import { AppState } from '../store';
import { selectCurrentUser } from "../store/selectors";

function Home(props: PropsFromRedux) {
  const { user } = props;

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

type PropsType = {
  user: any
}

const mapStateToProps = () => createStructuredSelector<AppState, PropsType>({
  user: selectCurrentUser
})

const mapDispatchToProps = (dispatch: any) => ({

})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(Home);
