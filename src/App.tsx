import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import "firebase/auth";
import React from "react";
import { Route, Switch } from "react-router-dom";
import Account from "./components/Account";
import AppBar from "./components/Appbar";
import Drawer from "./components/Drawer";
import Home from "./components/Home";
import QuestionAnswering from "./components/QuestionAnswering";
import TextSummarization from "./components/TextSummarization";
import ImageLabeling from "./components/ImageLabeling";
import { useQuery } from "@apollo/client";
import ContentLoading from "./components/ContentLoading";
import { GET_CURRENT_USER } from "./gql-queries";
import { Typography } from "@material-ui/core";
import assert from "assert";
import { useUpdateActiveOrg } from "./components/UseUpdateActiveOrg";
import ImageCollectionPage from "./components/ImageLabeling/ImageCollectionPage/ImageCollectionPage";

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

function AppActiveOrgWrapper() {
  // makes sure the url search params are set properly,

  const { loading, error } = useUpdateActiveOrg(); 

  if (error) {
    console.error(error);
    return <Typography>{"Unkown error occurred"}</Typography>
  }

  if (loading) {
    return <ContentLoading/>
  }

  return <App/>;
}

function App() {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_CURRENT_USER);

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
    return <Typography>{"Unkown error occurred"}</Typography>
  }

  if (loading) {
    return <ContentLoading/>;
  }

  assert.notEqual(data, null);

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
          <Route exact path="/image-labeling/:tab">
            <ImageLabeling />
          </Route>
          <Route exact path="/image-labeling/collections/:collectionId/:tab">
            <ImageCollectionPage />
          </Route>
          <Route path="/text-labeling"></Route>
          <Route path="/"></Route>
        </Switch>
      </main>
    </div>
  );
}

export default AppActiveOrgWrapper;
