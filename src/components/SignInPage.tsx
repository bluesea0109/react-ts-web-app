import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useDispatch } from "react-redux";
import { signIn } from '../store/auth/actions';
import { Grid, makeStyles, Theme, createStyles } from '@material-ui/core';
import axios from "axios";
import config from '../config';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginCol: {
    },
    root: {
      height: '100vh'
    },
    filler: {
      background: 'linear-gradient(45deg, #1565c0 30%, #00c853 90%)'
    }
  }));

function getCookie(name: string) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

var postIdTokenToSessionLogin = function(idToken: any, csrfToken: any) {
  return axios({
    method: 'post',
    url: `${config.apiBaseUrl}/sessionLogin`,
    data: {
      idToken,
      csrfToken
    },
  });
};


function SignInPage(props: any) {
  const classes = useStyles();

  const dispatch = useDispatch()
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
        // If a user signed in with email link, ?showPromo=1234 can be obtained from
        // window.location.href.
        dispatch(signIn(authResult.user));

        authResult.user.getIdToken().then((idToken: any) => {
          // Session login endpoint is queried and the session cookie is set.
          // CSRF protection should be taken into account.
          // ...
          const csrfToken = getCookie('csrfToken')
          return postIdTokenToSessionLogin(idToken, csrfToken);
        });


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