import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { signIn } from '../store/auth/actions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginCol: {
    },
    root: {
      height: '100vh',
    },
    filler: {
      background: 'linear-gradient(45deg, #1565c0 30%, #29b6f6 90%)',
    },
  }));

function SignInPage(props: any) {
  const classes = useStyles();

  const dispatch = useDispatch();
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
          prompt: 'select_account',
        },
      },
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult (authResult: any, redirectUrl?: string) {
        // If a user signed in with email link, ?showPromo=1234 can be obtained from
        // window.location.href.
        dispatch(signIn(authResult.user));

        const state: any = location.state;

        if (history.action === 'REPLACE' && state && state.referrer) {
          history.push(state.referrer);
        } else if (!redirectUrl) {
          props.history.push('/');
        }
        return false;
      },
    },
  };

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} container={true} xs={4} justify="center" alignItems="center" className={classes.loginCol}>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
      </Grid>
      <Grid item={true} xs={8} className={classes.filler}/>
    </Grid>
  );
}

export default SignInPage;
