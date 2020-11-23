import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useMemo } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useHistory, useLocation } from 'react-router-dom';
import { EMAIL_ENTER_SCREEN, INITIAL_SCREEN } from './constants';
import SignInFiller from './SignInFiller';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
    },

    firebaseUIBox: {
      '& .firebaseui-idp-button': {
        border: '1px solid #0061FF !important',
        backgroundColor: 'white !important',

        '& .firebaseui-idp-text': {
          color: '#0061FF !important',
        },

        '&.firebaseui-idp-password': {
          '& .firebaseui-idp-icon-wrapper': {
            backgroundColor: '#db4437 !important',
          },
        },
      },

      '& .mdl-shadow--2dp': {
        boxShadow: 'none !important',

        '& .firebaseui-card-header': {
          display: 'none !important',
        },

        '& .firebaseui-card-content': {
          padding: '0px !important',
        },

        '& .firebaseui-card-actions': {
          padding: '0px !important',

          '& .firebaseui-form-actions': {
            display: 'flex !important',
            flexDirection: 'column-reverse !important',
          },
        },
      },
    },
  }),
);

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
          prompt: 'select_account',
        },
      },
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult(authResult: any, redirectUrl?: string) {
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

  const currentScreen = useMemo(() => {
    if (location.search === '?mode=select') {
      return EMAIL_ENTER_SCREEN;
    }
    return INITIAL_SCREEN;
  }, [location]);

  return (
    <Grid container={true} className={classes.root}>
      <Grid
        item={true}
        container={true}
        xs={4}
        justify="center"
        alignItems="center">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" alignItems="center" my={2}>
            <img src={'/logo512.png'} alt="logo" width="60px" height="60px" />
            <Typography variant="h6">Bavard</Typography>
          </Box>

          {currentScreen === INITIAL_SCREEN && (
            <Box textAlign="center" my={2}>
              <Typography variant="h6">Log In</Typography>
              <Typography variant="subtitle1">
                Choose how you would like to sign in below.
              </Typography>
              <Typography variant="subtitle1">
                You can create an account with each option.
              </Typography>
            </Box>
          )}

          {currentScreen === EMAIL_ENTER_SCREEN && (
            <Box textAlign="center" my={2}>
              <Typography variant="h6">Enter your Email Address</Typography>
              <Typography variant="subtitle1">
                If you do not have an account yet you can choose a password on
                the next screen.
              </Typography>
            </Box>
          )}

          <Box>
            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
              className={classes.firebaseUIBox}
            />
          </Box>
        </Box>
      </Grid>
      <SignInFiller />
    </Grid>
  );
}

export default SignInPage;
