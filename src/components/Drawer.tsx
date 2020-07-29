import { createStyles, IconButton, Theme, useTheme } from '@material-ui/core';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IUser } from '../models/user-service';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      maxWidth: 250,
    },
    fullList: {
      width: 'auto',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }));

interface CustomDrawerProps extends DrawerProps {
  user: IUser;
}

function CustomDrawer(props: CustomDrawerProps) {
  const { user, ...drawProps } = props;
  const classes = useStyles();
  const location = useLocation();
  const theme = useTheme();

  if (!user.activeOrg) {

  }

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

  const requiresActiveProjectListItems = (
    <>
      <ListItem
        component={Link}
        to={createPath('qa')}
        selected={location.pathname.includes('/qa')}
        button={true}
      >
        <ListItemText primary="Question Answering" />
      </ListItem>
      {/* <ListItem
        component={Link}
        to={createPath('text-summarization')}
        selected={location.pathname.includes('text-summarization')}
        button={true}
      >
        <ListItemText primary="Text Summarization" />
      </ListItem> */}
      <ListItem
        component={Link}
        to={createPath('chatbot-builder')}
        selected={location.pathname.includes('chatbot-builder')}
        button={true}
      >
        <ListItemText primary="Chatbot Builder" />
      </ListItem>
      <ListItem
        component={Link}
        to={createPath('text-labeling')}
        selected={location.pathname.includes('text-labeling')}
        button={true}
      >
        <ListItemText primary="Text Labeling" />
      </ListItem>
      <ListItem
        component={Link}
        to={createPath('image-labeling/collections')}
        selected={location.pathname.includes('image-labeling')}
        button={true}
      >
        <ListItemText primary="Image Labeling" />
      </ListItem>
      {/* <ListItem
        component={Link}
        to={createPath('graph-policies')}
        selected={location.pathname.includes('graph-policies')}
        button={true}
      >
        <ListItemText primary="Graph Policies" />
      </ListItem> */}
    </>
  );

  const list = () => (
    <div className={classes.list} role="presentation">
      <div className={classes.drawerHeader}>
        <IconButton
          onClick={(ev) =>
            props.onClose ? props.onClose(ev, 'backdropClick') : null
          }
        >
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
              <ChevronRightIcon />
            )}
        </IconButton>
      </div>
      <List>
        <ListItem
          component={Link}
          to="/"
          selected={location.pathname === '/'}
          button={true}
        >
          <ListItemText primary="Dashboard" />
        </ListItem>
        <List component="div" disablePadding={true}>
          <ListItem className={classes.nested}
            component={Link}
            to={createOrgPath('settings')}
            selected={!location.pathname.includes('projects') && location.pathname.includes('settings')}
            button={true}
          >
            <ListItemText primary="Organization" />
          </ListItem>
          <ListItem className={classes.nested}
            component={Link}
            to={createPath('settings')}
            selected={location.pathname.includes('projects') && location.pathname.includes('settings')}
            button={true}>
            <ListItemText primary="Project" />
          </ListItem>
        </List>
        {requiresActiveProjectListItems}
      </List>
    </div >
  );

  return (
    <Drawer anchor="left" {...drawProps}>
      {list()}
    </Drawer>
  );
}

export default CustomDrawer;
