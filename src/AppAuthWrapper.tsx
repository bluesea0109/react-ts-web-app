import firebase from "firebase/app";
import "firebase/auth";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import App from "./App";
import SignInPage from "./components/SignInPage";
import { signIn } from "./store/auth/actions";
import { getAuthState } from "./store/selectors";
import ContentLoading from "./components/ContentLoading";


function AppAuthWrapper() {
  const authState = useSelector(getAuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        if (user) {
          dispatch(signIn(user));
          const token = await user.getIdToken();
          console.log(`Bearer ${token}`);
        } else {
          dispatch(signIn(null));
        }
      });

    return function cleanup() {
      unregisterAuthObserver();
    };
  }, [dispatch]);

  if (authState.isFetching) {
    return <ContentLoading />;
  }

  if (!authState.user) {
    return (
      <SignInPage />
    );
  }

  return <App />
}

export default AppAuthWrapper;
