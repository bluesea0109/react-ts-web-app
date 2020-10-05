import { createStyles, Theme } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import { blue } from '@material-ui/core/colors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SubMenuIcon from '../components/IconButtons/SubMenuIcon';
import { IUser } from '../models/user-service';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      maxWidth: 250,
      backgroundColor: '#151630',
      color: 'white',
    },
    fullList: {
      width: 'auto',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      margin: '15px 0px',
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      backgroundColor: '#151630',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    listItem: {
      color: 'white',
    },
    blank: {
      height: '100px',      
    },
    selected: {
      backgroundColor: 'red'
    }
  })
);

interface CustomDrawerProps {
  user: IUser;
  status: boolean;
  navigation: number;
}

function CustomDrawer(props: CustomDrawerProps) {
  const { user, navigation } = props;

  console.log('navigation =>  ', navigation);
  const classes = useStyles();
  const location = useLocation();

  const createPath = (pageName: string): string => {
    if (!user.activeProject) {
      return '/no-project';
    }
    return `/orgs/${user.activeProject.orgId}/projects/${user.activeProject.id}/${pageName}`;
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

  const list = () => {
    return navigation === 1 ? (
      <List>
        <ListItem className={classes.blank}></ListItem>
        <ListItem
          component={Link}
          to={createOrgPath('settings')}
          selected={
            !location.pathname.includes('projects') &&
            location.pathname.includes('settings')
          }
          button={true}
          className={classes.listItem + (!location.pathname.includes('projects') && location.pathname.includes('settings'))}>
          <ListItemIcon style={{ color: 'white' }}>
            <SubMenuIcon title="Organization" />
          </ListItemIcon>
          <ListItemText primary="Organization" />
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
            <SubMenuIcon title="Project" />
          </ListItemIcon>
          <ListItemText primary="Project" />
        </ListItem>
      </List>
    ) : (
      <List>
        <ListItem className={classes.blank}></ListItem>
        <ListItem
          component={Link}
          to={createPath('chatbot-builder')}
          selected={/chatbot-builder$/.test(location.pathname)}
          button={true}
          className={classes.listItem}>
          <ListItemIcon style={{ color: 'white' }}>
            <SubMenuIcon title="BotBuilder" />
          </ListItemIcon>
          <ListItemText primary="Chatbot Builder" />
        </ListItem>{' '}
        <ListItem
          component={Link}
          to={createPath('image-labeling/collections')}
          selected={location.pathname.includes('image-labeling')}
          button={true}
          className={classes.listItem}>
          <ListItemIcon style={{ color: 'white' }}>
            <SubMenuIcon title="ImageLabeling" />
          </ListItemIcon>
          <ListItemText primary="Image Labeling" />
        </ListItem>
        <ListItem
          component={Link}
          to={createPath('qa')}
          selected={location.pathname.includes('/qa')}
          button={true}
          className={classes.listItem}>
          <ListItemIcon style={{ color: 'white' }}>
            <SubMenuIcon title="FAQ" />
          </ListItemIcon>
          <ListItemText primary="FAQ Service" />
        </ListItem>
        <ListItem
          component={Link}
          to={createPath('text-labeling')}
          selected={location.pathname.includes('text-labeling')}
          button={true}
          className={classes.listItem}>
          <ListItemIcon style={{ color: 'white' }}>
            <SubMenuIcon title="TextLabeling" />
          </ListItemIcon>
          <ListItemText primary="Text Labeling" />
        </ListItem>
      </List>
    );
  };
  return <>{list()}</>;
}

export default CustomDrawer;
