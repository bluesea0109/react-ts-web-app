import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { useDispatch } from "react-redux";
import { signIn } from '../store/auth/actions';

function SignInPage(props: any) {
  const dispatch = useDispatch()
  const auth = firebase.auth();
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
    <div>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}></StyledFirebaseAuth>
    </div>
  );
};

export default SignInPage;