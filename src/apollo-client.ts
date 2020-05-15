import { setContext } from 'apollo-link-context'
import firebase from 'firebase/app';
import config from "./config";
import { createUploadLink } from 'apollo-upload-client'
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

console.log("API URL:", config.apiUrl);
console.log("Project Id:", config.projectId);

const getIdToken = async () => {
  const user = firebase.auth().currentUser;
  if (user) {
    const token = await user.getIdToken();
    return token;
  }
  throw new Error('Failed to get firebase id token');
}

const authLink = setContext((_, { headers }) => {
  return getIdToken().then(token => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`
      }
    };
  });
});

export default new ApolloClient({
  link: authLink.concat(createUploadLink({ uri: config.apiUrl })),
  cache: new InMemoryCache(),
});