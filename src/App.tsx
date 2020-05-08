import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import "firebase/auth";
import React from "react";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import Account from "./components/account";
import AppBar from "./components/Appbar";
import Drawer from "./components/Drawer";
import Home from "./components/Home";
import QuestionAnswering from "./components/question-answering";
import TextSummarization from "./components/text-summarization";
import { useQuery, gql } from "@apollo/client";
import ContentLoading from "./components/ContentLoading";

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

const GET_DATA = gql`
  query {
    currentUser {
      activeOrgId
      activeProjectId
    }
  }
`

function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const history = useHistory();
  const location = useLocation();
  const query = useQueryParams();
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_DATA);

  const [state, setState] = React.useState({
    drawerOpen: false,
  });

  const onMenuClick = () => {
    setState({ ...state, drawerOpen: !state.drawerOpen });
  };

  const onDrawerClose = () => {
    setState({ ...state, drawerOpen: false });
  };

  if (error) {
    console.log(error);
  }

  if (loading) {
    return <ContentLoading/>
  }
  
  const orgParam = query.get('org');
  if (!orgParam && data) {
    console.log(data);
    history.push({
      pathname: location.pathname,
      search: `?org=${data.currentUser.activeOrgId}`,
    });
  } else {
    // TODO: set active org id if different from current active org id
  }

  return (
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
  );
}

export default App;
