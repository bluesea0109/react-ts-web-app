import { createMuiTheme, ThemeOptions } from '@material-ui/core/styles';

const baseTheme: ThemeOptions = {
  overrides: {
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
      main: '#24292e',
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
