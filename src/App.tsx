import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import "firebase/auth";
import React from "react";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import Account from "./components/account";
import AppBar from "./components/Appbar";
import Drawer from "./components/Drawer";
import Home from "./components/Home";
import QuestionAnswering from "./components/QuestionAnswering";
import TextSummarization from "./components/TextSummarization";
import ImageLabeling from "./components/ImageLabeling";
import { useQuery, useMutation } from "@apollo/client";
import ContentLoading from "./components/ContentLoading";
import { UPDATE_ACTIVE_ORG, GET_CURRENT_USER } from "./gql-queries";
import { Typography } from "@material-ui/core";

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
      padding: theme.spacing(2),
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

function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const history = useHistory();
  const location = useLocation();
  const query = useQueryParams();
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_CURRENT_USER);
  const [updateActiveOrg, updateActiveOrgResult] = useMutation(UPDATE_ACTIVE_ORG,
    {
      refetchQueries: [{ query: GET_CURRENT_USER }],
      awaitRefetchQueries: true
    });

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

  if (updateActiveOrgResult.error) {
    console.log(updateActiveOrgResult.error);
    return <Typography>{"Unkown error occurred"}</Typography>
  }

  if (loading || updateActiveOrgResult.loading) {
    return <ContentLoading />
  }

  const orgParam = query.get('org');
  const projectParam = query.get('project');

  if (data) {
    const { activeOrg, activeProject } = data.currentUser;
    const activeOrgId = activeOrg ? activeOrg.id : null;
    const activeProjectId = activeProject ? activeProject.id : null;

    // If one param is null but it's corresponding user value is not null, update the url
    if ((orgParam == null && activeOrgId)) {
      let search = `?org=${activeOrgId}`;
      if (activeProjectId) {
        search += `&project=${activeProjectId}`
      }
      history.push({ pathname: location.pathname, search });
      console.log('updated url');
      window.location.reload(false);
      return <ContentLoading />;
    }

    // If org or project params differ from the current user values, update the active org
    if (orgParam !== activeOrgId || projectParam !== activeProjectId) {
      // todo: If updateActiveOrg returns an error, show a proper error page.
      console.log("project param", projectParam);
      console.log("project id", activeProjectId);

      console.log('Updating active org/project');
      updateActiveOrg({
        variables: {
          orgId: orgParam,
          projectId: projectParam
        }
      });
      return <ContentLoading/>
    }
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
            <ImageLabeling />
          </Route>
          <Route path="/text-labeling"></Route>
          <Route path="/"></Route>
        </Switch>
      </main>
    </div>
  );
}

export default App;
