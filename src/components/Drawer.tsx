import { createStyles, Theme } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
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

    active: {
      backgroundColor: 'red',
    },

    blank: {
      height: '105px',
    },

    selected: {
      backgroundColor: 'red',
    },
  }),
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
  const selectedStyle = {
    backgroundColor: '#4A90E2',
    padding: '10px',
    borderRadius: '5px',
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

  const list = () => {
    return navigation === 1 ? (
      <List>
        <ListItem className={classes.blank}/>
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
            <SubMenuIcon title="Organization" active={false}/>
          </ListItemIcon>
          <ListItemText
            primary="Organization"
            style={
              !location.pathname.includes('projects') &&
              location.pathname.includes('settings')
                ? selectedStyle
                : {}
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
            <SubMenuIcon title="Project" active={false}/>
          </ListItemIcon>
          <ListItemText
            primary="Project"
            style={
              location.pathname.includes('projects') &&
              location.pathname.includes('settings')
                ? selectedStyle
                : {}
            }
          />
        </ListItem>
      </List>
    ) : (
      <List>
        <ListItem className={classes.blank}/>
        <ListItem
          component={Link}
          to={createPath('chatbot-builder')}
          selected={/chatbot-builder$/.test(location.pathname)}
          button={true}
          className={classes.listItem}>
          <ListItemIcon style={{ color: 'white' }}>
            <SubMenuIcon title="BotBuilder" active={false}/>
          </ListItemIcon>
          <ListItemText
            primary="Chatbot Builder"
            style={
              /chatbot-builder$/.test(location.pathname) ? selectedStyle : {}
            }
          />
        </ListItem>{' '}
        <ListItem
          component={Link}
          to={createPath('image-labeling/collections')}
          selected={location.pathname.includes('image-labeling')}
          button={true}
          className={classes.listItem}>
          <ListItemIcon style={{ color: 'white' }}>
            <SubMenuIcon title="ImageLabeling" active={false}/>
          </ListItemIcon>
          <ListItemText
            primary="Image Labeling"
            style={
              location.pathname.includes('image-labeling') ? selectedStyle : {}
            }
          />
        </ListItem>
        <ListItem
          component={Link}
          to={createPath('qa')}
          selected={location.pathname.includes('/qa')}
          button={true}
          className={classes.listItem}>
          <ListItemIcon style={{ color: 'white' }}>
            <SubMenuIcon title="FAQ" active={false}/>
          </ListItemIcon>
          <ListItemText
            primary="FAQ Service"
            style={location.pathname.includes('/qa') ? selectedStyle : {}}
          />
        </ListItem>
        <ListItem
          component={Link}
          to={createPath('text-labeling')}
          selected={location.pathname.includes('text-labeling')}
          button={true}
          className={classes.listItem}>
          <ListItemIcon style={{ color: 'white' }}>
            <SubMenuIcon title="TextLabeling" active={false}/>
          </ListItemIcon>
          <ListItemText
            primary="Text Labeling"
            style={
              location.pathname.includes('text-labeling') ? selectedStyle : {}
            }
          />
        </ListItem>
      </List>
    );
  };
  return <>{list()}</>;
}

export default CustomDrawer;
