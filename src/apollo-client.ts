import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import firebase from 'firebase/app';
import { isEmpty } from 'lodash';
import config from './config';
import { parseJwt } from './utils';

console.log('API URL:', config.apiUrl);
console.log('project id:', config.projectId);

const getIdToken = async () => {
  const token = sessionStorage.getItem('token') ?? '';
  const user = firebase.auth().currentUser;

  const fetchNewToken = async () => {
    if (user) {
      const token = await user.getIdToken();
      const customToken = await exchangeFirebaseToken(token);

      console.log('TOKEN: ', customToken);

      sessionStorage.setItem('token', customToken);

      return customToken;
    }

    throw new Error('Failed to get an access token');
  };

  if (!isEmpty(token)) {
    const { exp, sub } = parseJwt(token);

    if ((exp * 1000) - (Date.now()) <= 5 * 60 * 1000) {
      return await fetchNewToken();
    }

    if (sub !== user?.uid) {
      return await fetchNewToken();
    }

    return token;
  } else {
    return await fetchNewToken();
  }
};

const exchangeFirebaseToken = async (token: string): Promise<string> => {
  const urlifiedToken = encodeURIComponent(`Bearer ${token}`);
  const url = `${config.apiBaseUrl}/v1/bavard-auth-token?firebaseToken=${urlifiedToken}`;

  const data = await fetch(url, {
    method: 'POST',
  }).then(resp => resp.json());

  return data.token;
};

const authLink = setContext((_, { headers }) => {
  return getIdToken().then((token) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  });
});

export const client = new ApolloClient({
  link: authLink.concat(createUploadLink({ uri: config.apiUrl }) as any),
  cache: new InMemoryCache({
    possibleTypes: {
      ChatbotService_Action: ['ChatbotService_UtteranceAction'],
      ChatbotService_DialogueTurn: ['ChatbotService_AgentAction', 'ChatbotService_UserAction'],
      ChatbotService_UserResponseOption: [
        'ChatbotService_ImageOption',
        'ChatbotService_TextOption',
        'ChatbotService_HyperlinkOption',
      ],
    },
  }),
});

export const resetApolloContext = () => {
  sessionStorage.removeItem('token');
};
