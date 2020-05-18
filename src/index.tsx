import React from 'react';
import ReactDOM from 'react-dom';
import './config'; // initializes firebase
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import configureStore from './store';
import { BrowserRouter as Router } from 'react-router-dom';
import { client } from './apollo-client';
import AppAuthWrapper from './AppAuthWrapper';
import { ApolloProvider } from 'react-apollo';

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Router>
          <AppAuthWrapper />
        </Router>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
