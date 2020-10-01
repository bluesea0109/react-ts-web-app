import { createStyles, IconButton, Theme, useTheme } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import IconButtonBavard from '../components/IconButtons/IconButtonBavard';
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
  }),
);

interface CustomDrawerProps {
  user: IUser;
  onIconClick: () => void;
  status: boolean;
}

function CustomDrawer(props: CustomDrawerProps) {
  const { user, onIconClick, status } = props;
  const classes = useStyles();
  const location = useLocation();
  const theme = useTheme();
  const [dashOpen, setDashOpen] = useState(false);

  const handleClick = () => {
    setDashOpen(!dashOpen);
  };
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
        to={createPath('chatbot-builder')}
        selected={/chatbot-builder$/.test(location.pathname)}
        button={true}>
        <ListItemIcon style={{ color: 'white' }}>
          <SubMenuIcon title="BotBuilder" />
        </ListItemIcon>
        <ListItemText primary="Chatbot Builder" />
      </ListItem>
      <ListItem
        component={Link}
        to={createPath('image-labeling/collections')}
        selected={location.pathname.includes('image-labeling')}
        button={true}>
        <ListItemIcon style={{ color: 'white' }}>
          <SubMenuIcon title="ImageLabeling" />
        </ListItemIcon>
        <ListItemText primary="Image Labeling" />
      </ListItem>
      <ListItem
        component={Link}
        to={createPath('qa')}
        selected={location.pathname.includes('/qa')}
        button={true}>
        <ListItemIcon style={{ color: 'white' }}>
          <SubMenuIcon title="FAQ" />
        </ListItemIcon>
        <ListItemText primary="FAQ Service" />
      </ListItem>
      <ListItem
        component={Link}
        to={createPath('text-labeling')}
        selected={location.pathname.includes('text-labeling')}
        button={true}>
        <ListItemIcon style={{ color: 'white' }}>
          <SubMenuIcon title="TextLabeling" />
        </ListItemIcon>
        <ListItemText primary="Text Labeling" />
      </ListItem>
    </>
  );

  const list = () => (
    <div className={classes.list} role="presentation">
      <div className={classes.drawerHeader}>
        <IconButtonBavard
          tooltip="barvard button"
          disabled={false}
          onClick={onIconClick}
        />
      </div>
      <List>
        <ListItem
          component={Link}
          to="/"
          selected={location.pathname === '/'}
          button={true}
          onClick={handleClick}>
          <ListItemIcon style={{ color: 'white' }}>
            <SubMenuIcon title="Dashboard" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
          {status ? dashOpen ? <ExpandLess /> : <ExpandMore /> : ''}
        </ListItem>
        <Collapse in={dashOpen} timeout="auto" unmountOnExit={true}>
          <List component="div" disablePadding={true}>
            <List component="div" disablePadding={true}>
              <ListItem
                className={status ? classes.nested : ''}
                component={Link}
                to={createOrgPath('settings')}
                selected={
                  !location.pathname.includes('projects') &&
                  location.pathname.includes('settings')
                }
                button={true}>
                <ListItemIcon style={{ color: 'white' }}>
                  <SubMenuIcon title="Organization" />
                </ListItemIcon>
                <ListItemText primary="Organization" />
              </ListItem>
              <ListItem
                className={status ? classes.nested : ''}
                component={Link}
                to={createPath('settings')}
                selected={
                  location.pathname.includes('projects') &&
                  location.pathname.includes('settings')
                }
                button={true}>
                <ListItemIcon style={{ color: 'white' }}>
                  <SubMenuIcon title="Project" />
                </ListItemIcon>
                <ListItemText primary="Project" />
              </ListItem>
            </List>
          </List>
        </Collapse>
        {requiresActiveProjectListItems}
      </List>
    </div>
  );

  return <>{list()}</>;
}

export default CustomDrawer;
