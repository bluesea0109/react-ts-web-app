/// <reference types="react-scripts" />

// https://github.com/facebook/create-react-app/issues/10109
declare module 'react/jsx-runtime' {
  export default any;
}
