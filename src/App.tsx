
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import firebase from "firebase/app";
import "firebase/auth";
import React, { useEffect } from "react";
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Account from "./components/account";
import AppBar from "./components/Appbar";
import ContentLoading from "./components/ContentLoading";
import Drawer from "./components/Drawer";
import Home from "./components/Home";
import QuestionAnswering from "./components/question-answering";
import SignInPage from "./components/SignInPage";
import TextSummarization from "./components/text-summarization";
import { AppState } from './store';
import { signIn } from "./store/auth/actions";
import { AuthState } from "./store/auth/types";
import { selectAuth } from "./store/selectors";
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  })
);

function App(props: PropsFromRedux) {
  const classes = useStyles();
  const authState = props.authState;
  const dispatch = useDispatch();

  const [state, setState] = React.useState({
    drawerOpen: false,
  });

  const onMenuClick = () => {
    setState({ ...state, drawerOpen: !state.drawerOpen });
  };

  const onDrawerClose = () => {
    setState({ ...state, drawerOpen: false });
  };

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        if (user) {
          dispatch(signIn(user));
          const token = await user.getIdToken();
          console.log(`Bearer ${token}`);
        } else {
          dispatch(signIn(null));
        }
      });

    return function cleanup() {
      unregisterAuthObserver();
    };
  }, [dispatch]);

  if (authState.isFetching) {
    return <ContentLoading />;
  }
  if (!authState.user) {
    return (
      <Router>
        <SignInPage />
      </Router>
    );
  }

  return (
    <Router>
      <div className={classes.root}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: state.drawerOpen,
          })}
          onMenuClick={onMenuClick}
        />
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          classes={{
            paper: classes.drawerPaper,
          }}
          open={state.drawerOpen}
          onClose={onDrawerClose}
        ></Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: state.drawerOpen,
          })}
        >
          <div className={classes.drawerHeader} />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/account">
              <Account />
            </Route>
            <Route path="/qa">
              <QuestionAnswering />
            </Route>
            <Route path="/text-summarization">
              <TextSummarization />
            </Route>
            <Route path="/image-labeling">
              <div>
                <p>image labeling</p>
              </div>
            </Route>
            <Route path="/text-labeling"></Route>
            <Route path="/"></Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

type PropsType = {
  authState: AuthState
}

const mapStateToProps = () => createStructuredSelector<AppState, PropsType>({
  authState: selectAuth
})

const mapDispatchToProps = (dispatch: any) => ({

})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(App);
