import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Grid, makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginCol: {
    },
    root: {
      height: '100vh'
    },
    filler: {
      background: 'linear-gradient(45deg, #1565c0 30%, #29b6f6 90%)'
    }
  }));

function SignInPage(props: any) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const uiConfig: firebaseui.auth.Config = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/app/home',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        customParameters: {
          // Forces account selection even when one account
          // is available.
          prompt: 'select_account'
        }
      },
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult: any, redirectUrl?: string) {
        const state: any = location.state;

        if (history.action === 'REPLACE' && state && state.referrer) {
          history.push(state.referrer);
        }
        else if (!redirectUrl) {
          props.history.push("/");
        }
        return false;
      }
    },
  };

  return (
    <Grid container className={classes.root}>
      <Grid item container xs={4} justify="center" alignItems="center" className={classes.loginCol}>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}></StyledFirebaseAuth>
      </Grid>
      <Grid item xs={8} className={classes.filler}></Grid>
    </Grid>
  );
};

export default SignInPage;