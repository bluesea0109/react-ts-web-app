import * as firebase from 'firebase/app';

const dev = {
  projectId: "bavard-dev",
  apiBaseUrl: "https://api-gateway-dot-bavard-dev.appspot.com",
  apiUrl: "https://api-gateway-dot-bavard-dev.appspot.com/graphql",
  predictionServiceUrl: 'https://prediction-service-dot-bavard-dev.appspot.com/graphql',
  firebase: {
    apiKey: "AIzaSyDwt9YZ88n3dsp2bHS0nV7uU2oUULQLdo0",
    authDomain: "bavard-dev.firebaseapp.com",
    databaseURL: "https://bavard-dev.firebaseio.com",
    projectId: "bavard-dev",
    storageBucket: "bavard-dev.appspot.com",
    messagingSenderId: "1000511731189",
    appId: "1:1000511731189:web:7af80b3c5c852148959cbc",
    measurementId: "G-H5M6XJ6L86"
  }
};

const prod = {
  projectId: "bavard-prod",
  apiBaseUrl: "https://api-gateway-dot-bavard-prod.appspot.com",
  apiUrl: "https://api-gateway-dot-bavard-prod/graphql",
  predictionServiceUrl: 'https://prediction-service-dot-bavard-prod.appspot.com/graphql',
  firebase: {
    apiKey: "AIzaSyDwt9YZ88n3dsp2bHS0nV7uU2oUULQLdo0",
    authDomain: "bavard-dev.firebaseapp.com",
    databaseURL: "https://bavard-dev.firebaseio.com",
    projectId: "bavard-dev",
    storageBucket: "bavard-dev.appspot.com",
    messagingSenderId: "1000511731189",
    appId: "1:1000511731189:web:7af80b3c5c852148959cbc",
    measurementId: "G-H5M6XJ6L86"
  }
};

const local = {
  projectId: "bavard-dev",
  apiBaseUrl: "http://localhost:8080",
  apiUrl: "http://localhost:8080/graphql",
  predictionServiceUrl: 'https://prediction-service-dot-bavard-dev.appspot.com/graphql',
  firebase: {
    apiKey: "AIzaSyDwt9YZ88n3dsp2bHS0nV7uU2oUULQLdo0",
    authDomain: "bavard-dev.firebaseapp.com",
    databaseURL: "https://bavard-dev.firebaseio.com",
    projectId: "bavard-dev",
    storageBucket: "bavard-dev.appspot.com",
    messagingSenderId: "1000511731189",
    appId: "1:1000511731189:web:7af80b3c5c852148959cbc",
    measurementId: "G-H5M6XJ6L86"
  }
};

let config = local;

if (process.env.REACT_APP_ENV === "prod") {
  config = prod;
} else if (process.env.REACT_APP_ENV === "dev") {
  config = dev;
}


let env = process.env.REACT_APP_ENV;
console.log("env", env);

firebase.initializeApp(config.firebase);


export default config;