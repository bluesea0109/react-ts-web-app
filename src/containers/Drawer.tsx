import { Box, createStyles, Grid, Theme } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
      justifyContent: 'flex-end',
      padding: '10px 10px 0px 10px',
      height: '100px',
      cursor: 'pointer',
    },
    customDrawer: {

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
  ]},
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
  ]},
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
  agent: IAgentParam;
  onClose: () => void;
}

function CustomDrawer(props: CustomDrawerProps) {
  const { user, navigation, agent, onClose } = props;
  const classes = useStyles();
  const location = useLocation();

  const selectedStyle = {
    backgroundColor: '#4A90E2',
    padding: '8px',
    marginLeft: '10px',
    borderRadius: '5px',
    wordwrap: 'normal',
  };

  const createPath = (pageName: string): string => {
    if (!user.activeProject) {
      return '/no-project';
    }
    return `/orgs/${user.activeProject.orgId}/projects/${user.activeProject.id}/${pageName}`;
  };

  const getAgentPath = (agentTab: string, entityId?: string | number) => {
    return createAgentPath(user, agent.agentId, agentTab, entityId);
  };

  const createOrgPath = (path: string = ''): string => {
    if (!user.activeProject) {
      return '/no-orgs';
    }

    if (path !== '') {
      return `/orgs/${user.activeProject.orgId}/${path}`;
    }

    return `/orgs/${user.activeProject.orgId}`;
  };

  const saveHistory = () => {
    onClose();
    localStorage.setItem('backURL', location.pathname);
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
                <SubMenuIcon title="Organization" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Overview"
                style={
                  !location.pathname.includes('projects') &&
                  location.pathname === '/'
                    ? selectedStyle
                    : {paddingLeft: '20px'}
                }
              />
            </ListItem>
            <ListItem
              component={Link}
              to={createOrgPath('settings')}
              selected={
                !location.pathname.includes('projects') &&
                location.pathname.includes('settings')
              }
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Organization" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Organization"
                style={
                  !location.pathname.includes('projects') &&
                  location.pathname.includes('settings')
                    ? selectedStyle
                    : {paddingLeft: '20px'}
                }
              />
            </ListItem>
            <ListItem
              component={Link}
              to={createPath('settings')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('settings')
              }
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Project"
                style={
                  location.pathname.includes('projects') &&
                  location.pathname.includes('settings')
                    ? selectedStyle
                    : {paddingLeft: '20px'}
                }
              />
            </ListItem>
          </List>
        );
      case MenuName.OPEN_CONFIG:
        return <>
          <CloseDrawer handleClose={saveHistory}/>
          <BotSubMenu
            title={botSubMenuData.configure.category}
            items={botSubMenuData.configure.items}
            category="Configure" getAgentPath={getAgentPath}
          />
          <BotSubMenu
            title={botSubMenuData.training.category}
            items={botSubMenuData.training.items}
            category="Training" getAgentPath={getAgentPath}
          />
          <BotSubMenu
            title={botSubMenuData.launch.category}
            items={botSubMenuData.launch.items}
            category="Launch" getAgentPath={getAgentPath}
          />
        </>;
      default:
        return <></>;
    }
  };
  return <div className={classes.customDrawer}>{list()}</div>;
}

export default CustomDrawer;

interface CloseDrawerProps {
  handleClose: () => void;
}

const CloseDrawer = ({handleClose}: CloseDrawerProps) => {
  const classes = useStyles();
  const handleCloseDrawer = () => {
    handleClose();
  };
  return <Grid className={classes.closeDrawer}>
    <Box onClick={handleCloseDrawer}>
      <img src="/back.png" width="30px" height="30px" alt="backbutton"/>
    </Box>
  </Grid>;
};
