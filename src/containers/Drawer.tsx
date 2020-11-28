import { Box, createStyles, Grid, Theme } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { IAgentParam } from '../models/chatbot-service';
import { IUser } from '../models/user-service';
import { MenuName } from '../utils/enums';
import { createAgentPath } from '../utils/string';
import BotSubMenu from './ChatBuilderSubMenu';
import SubMenuIcon from './IconButtons/SubMenuIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      '*::-webkit-scrollbar': {
        width: '0.4em',
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(74, 144, 226, .7)',
        borderRadius: '10px',
      },
    },
    list: {
      maxWidth: 260,
      backgroundColor: '#151630',
      color: 'white',
    },
    fullList: {
      width: 'auto',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    listItem: {
      color: 'white',
      padding: '5px 5px 5px 20px',
      marginRight: '15px',
    },

    active: {
      backgroundColor: 'red',
    },

    blank: {
      height: '100px',
    },

    selected: {
      backgroundColor: 'red',
    },
    closeDrawer: {
      display: 'flex',
      padding: '10px 10px 0px 10px',
      flexDirection: 'column',
      cursor: 'pointer',
    },

    customDrawer: {},
    allAssistantButton: {
      padding: '10px',
      borderRadius: '5px',
      backgroundColor: 'rgba(74, 144, 226)',
      color: 'white',
      margin: '15px 130px 40px',
    },
  }),
);

export const botSubMenuData = {
  configure: {
    category: 'Configure',
    items: [
      {
        title: 'Actions',
        path: 'Actions',
      },
      {
        title: 'Intents',
        path: 'Intents',
      },
      {
        title: 'Tags',
        path: 'Tags',
      },
      {
        title: 'Slot Values',
        path: 'Slots',
      },
      {
        title: 'Visual Graphs V1.0',
        path: 'graph-policy-v1',
      },
      {
        title: 'Visual Graphs V2.0',
        path: 'graph-policies',
      },
    ],
  },
  training: {
    category: 'Training',
    items: [
      {
        title: 'Training Jobs',
        path: 'training-jobs',
      },
      {
        title: 'NLU Examples',
        path: 'nluExamples',
      },
      {
        title: 'Training Conversations',
        path: 'training-conversations',
      },
    ],
  },
  launch: {
    category: 'Launching',
    items: [
      {
        title: 'Assistant Demo',
        path: 'chats',
      },
      {
        title: 'Upload Data',
        path: 'upload-data',
      },
      {
        title: 'Live Conversations',
        path: 'live-conversations',
      },
      {
        title: 'Data Exports',
        path: 'exports',
      },
      {
        title: 'Design Settings',
        path: 'settings',
      },
      {
        title: 'Publish Assistant',
        path: 'publish',
      },
    ],
  },
};

interface CustomDrawerProps {
  user: IUser;
  status: boolean;
  navigation: MenuName;
  agent?: IAgentParam | undefined;
  onClose: () => void;
}

function CustomDrawer(props: CustomDrawerProps) {
  const { user, navigation, agent, onClose } = props;
  const classes = useStyles();
  const location = useLocation();
  const [currentAgentId, setCurrentAgentIdId] = useState(0);

  const selectedStyle = {
    backgroundColor: '#4A90E2',
    padding: '8px',
    marginLeft: '10px',
    borderRadius: '5px',
    wordwrap: 'normal',
  };

  const createPath = (pageName: string): string => {
    if (!user.activeWorkspace) {
      return '/no-workspace';
    }
    return `/workspaces/${user.activeWorkspace.id}/${pageName}`;
  };

  const getAgentPath = (agentTab: string, entityId?: string | number) => {
    return createAgentPath(user, currentAgentId, agentTab, entityId);
  };

  const createWorkspacePath = (path = ''): string => {
    if (!user.activeWorkspace) {
      return '/no-workspace';
    }

    if (path !== '') {
      return `/workspaces/${user.activeWorkspace.id}/${path}`;
    }

    return `/workspaces/${user.activeWorkspace.id}`;
  };

  useEffect(() => {
    const currentPath = location.pathname;
    setCurrentAgentIdId(parseInt(currentPath.split('/').reverse()[2]));
  }, [agent?.agentId, location.pathname]);
  const saveHistory = () => {
    onClose();
  };
  const list = () => {
    switch (navigation) {
      case MenuName.DASHBOARD:
        return (
          <List>
            <ListItem className={classes.blank} />
            <ListItem
              component={Link}
              to={''}
              selected={location.pathname.includes('')}
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Workspace" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Overview"
                style={
                  location.pathname === '/'
                    ? selectedStyle
                    : { paddingLeft: '20px' }
                }
              />
            </ListItem>
            <ListItem
              component={Link}
              to={createWorkspacePath('settings')}
              selected={location.pathname.includes('settings')}
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Workspace" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Workspace"
                style={
                  location.pathname.includes('settings')
                    ? selectedStyle
                    : { paddingLeft: '20px' }
                }
              />
            </ListItem>
            <ListItem
              component={Link}
              to={createWorkspacePath('billing')}
              selected={location.pathname.includes('billing')}
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Workspace" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Billing"
                style={
                  location.pathname.includes('billing')
                    ? selectedStyle
                    : { paddingLeft: '20px' }
                }
              />
            </ListItem>
          </List>
        );
      case MenuName.OPEN_CONFIG:
        return (
          <>
            <CloseDrawer
              handleClose={saveHistory}
              path={createPath('chatbot-builder')}
            />
            <BotSubMenu
              title={botSubMenuData.configure.category}
              items={botSubMenuData.configure.items}
              category="Configure"
              getAgentPath={getAgentPath}
            />
            <BotSubMenu
              title={botSubMenuData.training.category}
              items={botSubMenuData.training.items}
              category="Training"
              getAgentPath={getAgentPath}
            />
            <BotSubMenu
              title={botSubMenuData.launch.category}
              items={botSubMenuData.launch.items}
              category="Launch"
              getAgentPath={getAgentPath}
            />
          </>
        );
      default:
        return <></>;
    }
  };
  return <div className={classes.customDrawer}>{list()}</div>;
}

export default CustomDrawer;

interface CloseDrawerProps {
  handleClose: () => void;
  path: string;
}

const CloseDrawer = ({ handleClose, path }: CloseDrawerProps) => {
  const classes = useStyles();
  const history = useHistory();

  const handleCloseDrawer = () => {
    handleClose();
  };
  const openAllAgent = () => {
    history.push(path);
  };
  return (
    <Grid className={classes.closeDrawer}>
      <Box display="flex" justifyContent="flex-end" onClick={handleCloseDrawer}>
        <img src="/back.png" width="30px" height="30px" alt="backbutton" />
      </Box>
      <Box display="flex" justifyContent="flex-start" onClick={openAllAgent}>
        <Grid className={classes.allAssistantButton}>All Assistants</Grid>
      </Box>
    </Grid>
  );
};
