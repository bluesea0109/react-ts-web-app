import firebase from 'firebase/app';

const dev = {
  projectId: 'bavard-dev',
  apiBaseUrl: 'https://api.dev.bavard.ai',
  apiUrl: 'https://api.dev.bavard.ai/graphql',
  predictionServiceUrl: 'https://prediction-service-dot-bavard-dev.appspot.com/graphql',
  chatbotUrl: 'https://bavard-chatbot.web.app/widget/index.html',
  bundleUrl: 'https://bavard-chatbot.web.app/main.bundle.js',
  stripePublicKey: 'pk_test_51HL9t1DslhlvaFGjUIoSzWldID1pYsNstl7pRQadJQ2EGohCGoXuGrrEPr8K7bj4NyZKlwU3vMv8fM2bRSrvSNHK00nQSkQKke',
  firebase: {
    apiKey: 'AIzaSyDwt9YZ88n3dsp2bHS0nV7uU2oUULQLdo0',
    authDomain: 'bavard-dev.firebaseapp.com',
    databaseURL: 'https://bavard-dev.firebaseio.com',
    projectId: 'bavard-dev',
    storageBucket: 'bavard-dev.appspot.com',
    messagingSenderId: '1000511731189',
    appId: '1:1000511731189:web:7af80b3c5c852148959cbc',
    measurementId: 'G-H5M6XJ6L86',
  },
};

const prod = {
  projectId: 'bavard-prod',
  apiBaseUrl: 'https://api.prod.bavard.ai',
  apiUrl: 'https://api.prod.bavard.ai/graphql',
  predictionServiceUrl: 'https://prediction-service-dot-bavard-prod.appspot.com/graphql',
  chatbotUrl: 'https://bavard-chatbot.web.app/widget/index.html',
  bundleUrl: 'https://bavard-chatbot.web.app/main.bundle.js',
  stripePublicKey: 'pk_test_51HL9t1DslhlvaFGjUIoSzWldID1pYsNstl7pRQadJQ2EGohCGoXuGrrEPr8K7bj4NyZKlwU3vMv8fM2bRSrvSNHK00nQSkQKke',
  firebase: {
    apiKey: 'AIzaSyDFg05-2YvUvfjaufJoFpMubpQnJ_Z7R28',
    authDomain: 'bavard-prod.firebaseapp.com',
    databaseURL: 'https://bavard-prod.firebaseio.com',
    projectId: 'bavard-prod',
    storageBucket: 'bavard-prod.appspot.com',
    messagingSenderId: '420643638073',
    appId: '1:420643638073:web:62afd321a4aa6fa07036e8',
    measurementId: 'G-YE3QGZGFK2',
  },
};

const local = {
  projectId: 'bavard-dev',
  apiBaseUrl: 'http://localhost:8081',
  apiUrl: 'http://localhost:8081/graphql',
  predictionServiceUrl: 'https://prediction-service-dot-bavard-dev.appspot.com/graphql',
  chatbotUrl: 'http://localhost:8000/public/index.html',
  bundleUrl: 'https://localhost:8000/main.bundle.js',
  stripePublicKey: 'pk_test_51HL9t1DslhlvaFGjUIoSzWldID1pYsNstl7pRQadJQ2EGohCGoXuGrrEPr8K7bj4NyZKlwU3vMv8fM2bRSrvSNHK00nQSkQKke',
  firebase: {
    apiKey: 'AIzaSyDwt9YZ88n3dsp2bHS0nV7uU2oUULQLdo0',
    authDomain: 'bavard-dev.firebaseapp.com',
    databaseURL: 'https://bavard-dev.firebaseio.com',
    projectId: 'bavard-dev',
    storageBucket: 'bavard-dev.appspot.com',
    messagingSenderId: '1000511731189',
    appId: '1:1000511731189:web:7af80b3c5c852148959cbc',
    measurementId: 'G-H5M6XJ6L86',
  },
};

let config = local;

if (process.env.REACT_APP_ENV === 'prod') {
  config = prod;
} else if (process.env.REACT_APP_ENV === 'dev') {
  config = dev;
}

const env = process.env.REACT_APP_ENV;
console.log('env', env);

firebase.initializeApp(config.firebase);

export default config;
