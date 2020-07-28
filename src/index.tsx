import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { client } from './apollo-client';
import AppAuthWrapper from './AppAuthWrapper';
import './config'; // initializes firebase
import './index.css';
import * as serviceWorker from './serviceWorker';
import configureStore from './store';
import appTheme from './theme';
import { SnackbarProvider } from "notistack";

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider
      style={{ zIndex: 99999999999999999 }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      maxSnack={5}
    >
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Router>
            <ThemeProvider theme={appTheme.getMuiTheme()}>
              <AppAuthWrapper />
            </ThemeProvider>
          </Router>
        </Provider>
      </ApolloProvider>
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
