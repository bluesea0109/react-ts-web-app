import {
  ThemeOptions,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@material-ui/core/styles';

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
      main: '#0161FF',
      dark: '#0102E6',
    },
    success: {
      main: '#15845A',
      dark: '#0E7D63',
    },
    info: {
      main: '#64B5F6',
      light: '#EAF9FF',
    },
    secondary: {
      main: '#4A90E1',
      // main: '#1976d2'
    },
    background: {
      // paper: '#eeeeee', // light
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
