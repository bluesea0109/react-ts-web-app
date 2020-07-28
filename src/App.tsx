import { useQuery } from '@apollo/react-hooks';
import { Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import assert from 'assert';
import clsx from 'clsx';
import 'firebase/auth';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import { GET_CURRENT_USER } from './common-gql-queries';
import AppBar from './components/Appbar';
import ChatbotBuilder from './components/ChatbotBuilder';
import ContentLoading from './components/ContentLoading';
import Dashboard from './components/Dashboard';
import AcceptInvite from './components/Dashboard/Invites/AcceptInvite';
import OrganizationSettings from './components/Dashboard/OrganizationSettings';
import ProjectSettings from './components/Dashboard/ProjectSettings';
import Drawer from './components/Drawer';
import ImageLabeling from './components/ImageLabeling';
import QuestionAnswering from './components/QuestionAnswering';
import GraphPolicies from './components/GraphPolicies';
import { IUser } from './models/user-service';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerHeader: {
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexGrow: 1,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
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
    container: {
      padding: theme.spacing(2),
    },
  }),
);

function App() {
  const classes = useStyles();
  interface IGetCurrentUser {
    currentUser: IUser;
  }
  const { loading, error, data } = useQuery<IGetCurrentUser>(GET_CURRENT_USER);

  const [state, setState] = React.useState({
    drawerOpen: false,
  });

  const onMenuClick = () => {
    setState({ ...state, drawerOpen: !state.drawerOpen });
  };

  const onDrawerClose = () => {
    setState({ ...state, drawerOpen: false });
  };

  if (loading) {
    return <ContentLoading />;
  }

  if (error || !data) {
    console.log(error);
    return <Typography>{'Unkown error occurred'}</Typography>;
  }

  assert.notEqual(data, null);

  return !data && loading ? (
    <ContentLoading />
  ) : (
      <div className={classes.root}>
        <AppBar
          user={data.currentUser}
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: state.drawerOpen,
          })}
          onMenuClick={onMenuClick}
        />
        <Drawer
          user={data.currentUser}
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          classes={{
            paper: classes.drawerPaper,
          }}
          open={state.drawerOpen}
          onClose={onDrawerClose}
        />
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: state.drawerOpen,
          })}>
          <div className={classes.drawerHeader} />
          <Switch>
            <Route exact={true} path="/">
              <Dashboard user={data.currentUser} />
            </Route>
            <Route exact={true} path="/invites/:inviteId">
              <AcceptInvite />
            </Route>
            <Route exact={true} path="/orgs/:orgId/settings">
              <OrganizationSettings user={data.currentUser} />
            </Route>
            <Route exact={true} path="/orgs/:orgId/projects/:projectId/settings">
              <ProjectSettings />
            </Route>
            <Route path="/orgs/:orgId/projects/:projectId/qa">
              <QuestionAnswering />
            </Route>
            {/* <Route path="/orgs/:orgId/projects/:projectId/text-summarization">
            <TextSummarization />
            </Route> */}
            <Route path="/orgs/:orgId/projects/:projectId/image-labeling">
              <ImageLabeling />
            </Route>
            <Route path="/orgs/:orgId/projects/:projectId/chatbot-builder">
              <ChatbotBuilder user={data.currentUser} />
            </Route>
            <Route path="/orgs/:orgId/projects/:projectId/text-labeling" />
            <Route path="/orgs/:orgId/projects/:projectId/graph-policies">
              <GraphPolicies/>
            </Route>
            <Route exact={true} path="/no-project">
              <div className={classes.container}>
                <Typography>
                  {'No project is active. Please create or activate one.'}
                </Typography>
              </div>
            </Route>
            <Route exact={true} path="/no-orgs">
              <div className={classes.container}>
                <Typography>
                  {'No Organization found.'}
                </Typography>
              </div>
            </Route>
          </Switch>
        </main>
      </div>
    );
}

export default App;
