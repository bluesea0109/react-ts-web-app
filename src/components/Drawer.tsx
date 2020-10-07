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
    switch (navigation) {
      case 1:
        return (
          <List>
            <ListItem className={classes.blank} />
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
                <SubMenuIcon title="Project" active={false} />
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
        );
      case 2:
        return (
          <List>
            <ListItem className={classes.blank} />
            <ListItem
              component={Link}
              to={createOrgPath('actions')}
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
                primary="Actions"
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
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Intents"
                style={
                  location.pathname.includes('projects') &&
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
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Tags"
                style={
                  location.pathname.includes('projects') &&
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
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Slot Values"
                style={
                  location.pathname.includes('projects') &&
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
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Visual Graphs"
                style={
                  location.pathname.includes('projects') &&
                  location.pathname.includes('settings')
                    ? selectedStyle
                    : {}
                }
              />
            </ListItem>
          </List>
        );        
      case 3:
        return (
          <List>
            <ListItem className={classes.blank} />
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
                <SubMenuIcon title="Project" active={false} />
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
        );        
      case 4:
        return (
          <List>
            <ListItem className={classes.blank} />
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
                <SubMenuIcon title="Project" active={false} />
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
        );        
      default:
        return <></>;
    }
  };
  return <>{list()}</>;
}

export default CustomDrawer;
