import { createStyles, IconButton, Theme, useTheme } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IUser } from '../models';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: 250,
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
  }));

interface CustomDrawerProps extends DrawerProps {
  user: IUser;
}

function CustomDrawer(props: CustomDrawerProps) {
  const classes = useStyles();
  const location = useLocation();
  const theme = useTheme();

  const user = props.user;
  if (!user.activeOrg) {

  }

  const createPath = (pageName: string): string => {
    if (!user.activeProject) {
      return '/no-project';
    }
    return `/orgs/${user.activeProject.orgId}/projects/${user.activeProject.id}/${pageName}`;
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
      <ListItem
        component={Link}
        to={createPath('text-summarization')}
        selected={location.pathname.includes('text-summarization')}
        button={true}
      >
        <ListItemText primary="Text Summarization" />
      </ListItem>
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
      <Divider />
      <List>
        <ListItem
          component={Link}
          to="/"
          selected={location.pathname === '/'}
          button={true}
        >
          <ListItemText primary="Dashboard" />
        </ListItem>
        {requiresActiveProjectListItems}
      </List>
    </div >
  );

  return (
    <Drawer anchor="left" {...props}>
      {list()}
    </Drawer>
  );
}

export default CustomDrawer;
