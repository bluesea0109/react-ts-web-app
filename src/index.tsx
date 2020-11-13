import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { client } from './apollo-client';
import AppAuthWrapper from './AppAuthWrapper';
import './config'; // initializes firebase
import './index.css';
import * as serviceWorker from './serviceWorker';
import configureStore from './store';
import appTheme from './theme';

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Router>
            <ThemeProvider theme={appTheme.getMuiTheme()}>
              <SnackbarProvider
                style={{ zIndex: 99999999999999999 }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                maxSnack={5}>
                <AppAuthWrapper />
              </SnackbarProvider>
            </ThemeProvider>
          </Router>
        </Provider>
      </ApolloProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
