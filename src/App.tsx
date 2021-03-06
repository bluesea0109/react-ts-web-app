import { useQuery } from '@apollo/client';
import { Drawer } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import 'firebase/auth';
import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { currentUser } from './atoms';
import { GET_CURRENT_USER } from './common-gql-queries';
import AppBar from './containers/Appbar';
import ChatbotBuilder from './containers/ChatbotBuilder';
import ContentLoading from './containers/ContentLoading';
import Dashboard from './containers/Dashboard';
import Billing from './containers/Dashboard/Billing';
import AcceptInvite from './containers/Dashboard/Invites/AcceptInvite';
import CustomDrawer from './containers/Drawer';
import FAQService from './containers/FAQService';
import ImageLabeling from './containers/ImageLabeling';
import NoWorkspacePage from './containers/NoWorkspacePage';
import MySidebar from './containers/Sidebar';
import TextLabeling from './containers/TextLabeling';
import { IUser } from './models/user-service';
import { MenuName } from './utils/enums';
import './App.css';
import ApolloErrorPage from './containers/ApolloErrorPage';

const drawerWidth = 300;

interface IGetCurrentUser {
  currentUser: IUser;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100vh',
      // overflow: 'hidden',
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerHeader: {
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: '#151630',
    },

    drawerOpen: {
      width: drawerWidth,
      backgroundColor: '#151630',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },

    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      backgroundColor: '#151630',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 7,
      },
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f4f4f4',
      overflow: 'hidden',
      flexGrow: 1,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
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
      backgroundColor: 'white',
      color: 'black',
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
  const [navKey, setNavKey] = useState(MenuName.NONE);
  const [agentId, setAgentId] = useState({ agentId: 0 });
  const [loadingAppBar, setLoadingAppBar] = useState(false);
  const [, setCurrentUser] = useRecoilState(currentUser);

  const { loading, error, data } = useQuery<IGetCurrentUser>(GET_CURRENT_USER, {
    onCompleted: (data) => {
      setCurrentUser(data.currentUser);
    },
  });

  const [state, setState] = React.useState({
    drawerOpen: false,
  });

  const handleChangeLoadingStatus = (loading: boolean) => {
    setLoadingAppBar(loading);
  };

  const onMenuClick = (key: MenuName) => {
    setState({ ...state, drawerOpen: true });
    setNavKey(key);
  };

  const onSetAgentID = (id: any) => {
    setAgentId({ agentId: id?.agentId });
  };

  const onDrawerClose = () => {
    setState({ ...state, drawerOpen: false });
  };

  if (loading || !data) {
    return <ContentLoading />;
  }

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

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
        handleChangeLoadingStatus={handleChangeLoadingStatus}
        closeDrawer={onDrawerClose}
      />
      <MySidebar
        user={data.currentUser}
        onClick={onMenuClick}
        onClose={onDrawerClose}
        onSetAgentID={onSetAgentID}
      />
      <Drawer
        style={{ backgroundColor: 'black' }}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: state.drawerOpen,
          [classes.drawerClose]: !state.drawerOpen,
        })}
        variant="permanent"
        anchor="left"
        classes={{
          paper: clsx({
            [classes.drawerOpen]: state.drawerOpen,
            [classes.drawerClose]: !state.drawerOpen,
          }),
        }}
        open={state.drawerOpen}
        onClose={onDrawerClose}>
        <CustomDrawer
          user={data.currentUser}
          status={state.drawerOpen}
          navigation={navKey}
          agent={agentId}
          onClose={onDrawerClose}
        />
      </Drawer>

      {loadingAppBar ? (
        <ContentLoading />
      ) : (
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
            <Route path="/workspaces/:workspaceId/qa">
              <FAQService />
            </Route>
            <Route path="/workspaces/:workspaceId/text-labeling">
              <TextLabeling />
            </Route>
            {/* <Route path="/workspaces/:workspaceId/text-summarization">
              <TextSummarization />
              </Route> */}
            <Route path="/workspaces/:workspaceId/image-labeling">
              <ImageLabeling />
            </Route>
            <Route path="/workspaces/:workspaceId/chatbot-builder">
              <ChatbotBuilder user={data.currentUser} />
            </Route>
            <Route path="/workspaces/:workspaceId/billing">
              <Billing />
            </Route>
            <Route path="/workspaces/:workspaceId/text-labeling" />
            <Route exact={true} path="/no-workspace">
              <NoWorkspacePage />
            </Route>
          </Switch>
        </main>
      )}
    </div>
  );
}

export default App;
