import { Box, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginCol: {},
    root: {
      height: '100vh',
    },
    filler: {
      background: 'linear-gradient(45deg, #1565c0 30%, #29b6f6 90%)',

      '& img': {
        position: 'absolute',
        right: 60,
        bottom: 0,
        width: 400,
        height: 598,
      },
    },
    fillerTextBox: {
      position: 'absolute',
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(10),
      paddingRight: theme.spacing(10),
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
      signInSuccessWithAuthResult (
        authResult: any,
        redirectUrl?: string,
      ) {
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
      <Grid
        item={true}
        container={true}
        xs={4}
        justify="center"
        alignItems="center"
        className={classes.loginCol}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" alignItems="center" my={2}>
            <img src={'/logo512.png'} alt="logo" width="60px" height="60px"/>
            <Typography variant="h6">
              Bavard
            </Typography>
          </Box>

          <Box textAlign="center" my={2}>
            <Typography variant="h6">
              Log In
            </Typography>
            <Typography variant="subtitle1">
              Choose how you would like to sign in below.
            </Typography>
            <Typography variant="subtitle1">
              You can create an account with each option.
            </Typography>
          </Box>

          <Box>
            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
              className={classes.firebaseUIBox}
            />
          </Box>
        </Box>
      </Grid>
      <Grid item={true} container={true} xs={8} className={classes.filler}>
        <Grid item={true} sm={12} lg={8} className={classes.fillerTextBox}>
          <Box pb={4}>
            <Typography variant="h4" style={{ color: 'white' }}>
              Engage your customers with smart, automated conversation.
            </Typography>
          </Box>
          <Typography variant="h6" style={{ color: 'white' }}>
            Our services can help you automate your e-commerce sales, lead generation, and customer engagement.
          </Typography>
        </Grid>
        <img src={'/chatbot-phone.png'} alt="Phone with Chatbot" />
      </Grid>
    </Grid>
  );
}

export default SignInPage;
