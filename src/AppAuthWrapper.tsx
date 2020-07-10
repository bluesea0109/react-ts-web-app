import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { resetApolloContext } from './apollo-client';
import App from './App';
import ContentLoading from './components/ContentLoading';
import SignInPage from './components/SignInPage';
import { usePrevious } from './utils/hooks';

function AppAuthWrapper() {
  const [state, setState] = useState({
    loading: true,
    isSignedIn: false,
  });

  const prevSignedIn = usePrevious<boolean>(state.isSignedIn);

  useEffect(() => {
    if (state.isSignedIn !== prevSignedIn) {
      resetApolloContext();
    }
  // eslint-disable-next-line
  }, [state.isSignedIn]);

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        if (user) {
          setState({
            loading: false,
            isSignedIn: true,
          });
          const token = await user.getIdToken();
          console.log(`Bearer ${token}`);
        } else {
          setState({
            loading: false,
            isSignedIn: false,
          });
        }
      });

    return function cleanup() {
      unregisterAuthObserver();
    };
  }, []);

  if (state.loading) {
    return <ContentLoading />;
  }

  if (!state.isSignedIn) {
    return (
      <SignInPage />
    );
  }

  return <App />;
}

export default AppAuthWrapper;
