import { createMuiTheme, ThemeOptions } from '@material-ui/core/styles';

const baseTheme: ThemeOptions = {
  overrides: {
    // Name of the component ⚛️ / style sheet
    // MuiButton: {
    //   // Name of the rule
    //   text: {
    //     // Some CSS
    //     background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',// '#40c4ff',//'linear-gradient(45deg, #00b0ff 30%, #00c853 90%)',
    //     background: 'linear-gradient(45deg, #00e676 30%, #00c853 90%)',// '#40c4ff',//'linear-gradient(45deg, #00b0ff 30%, #00c853 90%)',
    //     //borderRadius: 0,
    //     // border: 0,
    //     color: 'black',
    //     // padding: '0 30px',
    //     //boxShadow: 'none',
    //   },
    // },
    MuiList: {
      padding: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
    MuiDrawer: {
      paperAnchorDockedLeft: {
        borderRight: 0,
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 0,
      },
    },
  },
};

const darkTheme: ThemeOptions = {
  ...baseTheme,
  palette: {
    type: 'dark',
    primary: {
      main: '#424242',
    },
    secondary: {
      main: '#04AA51',
      // main: '#1976d2'
    },
    background: {
      paper: '#262626', // dark
      default: '#1b1b1b', // dark
    },
    text: {
      primary: '#ffffff',
    },
    contrastThreshold: 3,
  },

};

const lightTheme: ThemeOptions = {
  ...baseTheme,
  palette: {
    type: 'light',
    // divider:
    primary: {
      main: '#0161FF',
    },
    secondary: {
      main: '#04AA51',
      // main: '#1976d2'
    },
    background: {
      // paper: '#eeeeee', // light
      paper: '#f5f5f5',
      default: '#ffffff', // light
    },
    text: {
      primary: '#000000', // light
      secondary: '#000000',
    },
    contrastThreshold: 3,
  },
  overrides: {
    MuiCard: {
      root: {
        background: '#FFFFFF',
      },
    },
  },
};

const appTheme = {
  theme: lightTheme,
  setDark: () => {
    appTheme.theme = darkTheme;
  },
  setLight: () => {
    appTheme.theme = lightTheme;
  },
  getMuiTheme: () => {
    return createMuiTheme(appTheme.theme);
  },
};

export default appTheme;
