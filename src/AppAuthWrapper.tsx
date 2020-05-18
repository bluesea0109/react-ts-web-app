import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useEffect, useState } from 'react';
import App from './App';
import ContentLoading from './components/ContentLoading';
import SignInPage from './components/SignInPage';

function AppAuthWrapper() {
  const [state, setState] = useState({
    loading: true,
    isSignedIn: false,
  });

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
