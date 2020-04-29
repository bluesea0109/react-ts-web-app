import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from './components/Drawer';
import clsx from 'clsx';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAuthState } from './store/selectors';
import SignInPage from "./components/SignInPage";
import { signIn } from './store/auth/actions';
import firebase from 'firebase/app';
import 'firebase/auth';
import ContentLoading from './components/ContentLoading';
import QuestionAnswering from './components/question-answering'
import TextSummarization from './components/text-summarization'
import Home from './components/Home';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    drawerPaper: {
      width: drawerWidth,
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }),
);

function App() {
  const classes = useStyles();
  const authState = useSelector(getAuthState);
  const dispatch = useDispatch();

  const [state, setState] = React.useState({
    drawerOpen: false
  });

  const onMenuClick = () => {
    setState({ ...state, drawerOpen: !state.drawerOpen });
  };

  const onDrawerClose = () => {
    setState({ ...state, drawerOpen: false });
  }

  useEffect(() => {
    console.log('test');
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      async (user) => {

        if (user) {
          dispatch(signIn(user))

          const token = await user.getIdToken();
          console.log(`Bearer ${token}`);
        } else {
          dispatch(signIn(null))
        }
      }
    );
  
    return function cleanup() {
      unregisterAuthObserver();
    };
  }, [dispatch]);


  if (authState.isFetching) {
    return <ContentLoading/>
  } 
  if (!authState.user) {
    return (
      <Router>
        <SignInPage></SignInPage>
      </Router>
    );
  }

  return (
    <Router>
      <div className={classes.root}>
        <AppBar position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: state.drawerOpen,
          })}
        >
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={onMenuClick}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {"Bavard AI"}
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
        <Drawer

          className={classes.drawer}
          variant="persistent"
          anchor="left"
          classes={{
            paper: classes.drawerPaper,
          }}
          open={state.drawerOpen}
          onClose={onDrawerClose}></Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: state.drawerOpen,
          })}
        >
          <div className={classes.drawerHeader} />
          <Switch>
            <Route path="/">
              <Home/>
            </Route>
            <Route path="/qa">
              <QuestionAnswering/>
            </Route>
            <Route path="/text-summarization">
              <TextSummarization/>
            </Route>
            <Route path="/image-labeling">
              <div><p>image labeling</p></div>
            </Route>
            <Route path="/text-labeling">
            </Route>
            <Route path="/">
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
