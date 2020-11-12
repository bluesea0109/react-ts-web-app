import { createStyles, Theme } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IAgentParam } from '../models/chatbot-service';
import { IUser } from '../models/user-service';
import { MenuName } from '../utils/enums';
import { createAgentPath } from '../utils/string';
import SubMenuIcon from './IconButtons/SubMenuIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      maxWidth: 260,
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
      padding: '10px 5px 5px 15px',
      marginRight: '15px',
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
  navigation: MenuName;
  agent: IAgentParam;
}

function CustomDrawer(props: CustomDrawerProps) {
  const { user, navigation, agent } = props;
  const classes = useStyles();
  const location = useLocation();

  const selectedStyle = {
    backgroundColor: '#4A90E2',
    padding: '8px',
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

  const createChatbotBuilder = (path: string = ''): string => {
    if (!user.activeProject) {
      return '/no-orgs';
    }
    return `/orgs/${user.activeProject.orgId}/projects/${user.activeProject.id}/chatbot-builder`;
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
                    : {}
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
      case MenuName.CREATE_BOT:
      /*  return (
          <List>
            <ListItem className={classes.blank} />
            <ListItem
              component={Link}
              to={createChatbotBuilder()}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('/')
              }
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Agents"
                style={
                  location.pathname.includes('chatbot-builder')
                    ? selectedStyle
                    : {}
                }
              />
            </ListItem>
          </List>
        );  */
        return null
      case MenuName.OPEN_CONFIG:
        return (
          <List>
            <ListItem className={classes.blank} />
            <ListItem
              component={Link}
              to={getAgentPath('Actions')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('Actions')
              }
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Actions"
                style={
                  location.pathname.includes('Actions') ? selectedStyle : {}
                }
              />
            </ListItem>
            <ListItem
              component={Link}
              to={getAgentPath('Intents')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('Intents')
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
                  location.pathname.includes('Intents')
                    ? selectedStyle
                    : {}
                }
              />
            </ListItem>
            <ListItem
              component={Link}
              to={getAgentPath('Tags')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('Tags')
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
                  location.pathname.includes('Tags')
                    ? selectedStyle
                    : {}
                }
              />
            </ListItem>
            <ListItem
              component={Link}
              to={getAgentPath('Slots')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('Slots')
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
                  location.pathname.includes('Slots')
                    ? selectedStyle
                    : {}
                }
              />
            </ListItem>
            <ListItem
              component={Link}
              to={getAgentPath('graph-policy-v1')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('graph-policy-v1')
              }
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Visual Graphs V1.0"
                style={
                  location.pathname.includes('projects') &&
                  location.pathname.includes('graph-policy-v1')
                    ? selectedStyle
                    : {}
                }
              />
            </ListItem>
            <ListItem
              component={Link}
              to={getAgentPath('graph-policies')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('graph-policies')
              }
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Visual Graphs V2.0"
                style={
                  location.pathname.includes('projects') &&
                  (location.pathname.includes('graph-policies') ||
                    location.pathname.includes('graph-editor'))
                    ? selectedStyle
                    : {}
                }
              />
            </ListItem>
          </List>
        );
      case MenuName.OPEN_TRAINING:
        return (
          <List>
            <ListItem className={classes.blank} />
            <ListItem
              component={Link}
              to={getAgentPath('training-jobs')}
              selected={location.pathname.includes('training-jobs')}
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Training Jobs"
                style={
                  location.pathname.includes('training-jobs')
                    ? selectedStyle
                    : {}
                }
              />
            </ListItem>
            <ListItem
              component={Link}
              to={getAgentPath('nluExamples')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('nluExamples')
              }
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="NLU Examples"
                style={
                  location.pathname.includes('projects') &&
                  location.pathname.includes('nluExamples')
                    ? selectedStyle
                    : {}
                }
              />
            </ListItem>
            <ListItem
              component={Link}
              to={getAgentPath('training-conversations')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('training-conversations')
              }
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Training Conversations"
                style={
                  location.pathname.includes('projects') &&
                  location.pathname.includes('training-conversations')
                    ? selectedStyle
                    : {}
                }
              />
            </ListItem>
          </List>
        );
      case MenuName.OPEN_LAUNCHING:
        return (
          <List>
            <ListItem className={classes.blank} />
            <ListItem
              component={Link}
              to={getAgentPath('chats')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('chats')
              }
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Assistant Demo"
                style={location.pathname.includes('chats') ? selectedStyle : {}}
              />
            </ListItem>
            <ListItem
              component={Link}
              to={getAgentPath('upload-data')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('upload-data')
              }
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Upload Data"
                style={
                  location.pathname.includes('projects') &&
                  location.pathname.includes('upload-data')
                    ? selectedStyle
                    : {}
                }
              />
            </ListItem>
            <ListItem
              component={Link}
              to={getAgentPath('live-conversations')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('live-conversations')
              }
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Live Conversations"
                style={
                  location.pathname.includes('projects') &&
                  location.pathname.includes('live-conversations')
                    ? selectedStyle
                    : {}
                }
              />
            </ListItem>
            <ListItem
              component={Link}
              to={getAgentPath('exports')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('exports')
              }
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Data Exports"
                style={
                  location.pathname.includes('projects') &&
                  location.pathname.includes('exports')
                    ? selectedStyle
                    : {}
                }
              />
            </ListItem>
            <ListItem
              component={Link}
              to={getAgentPath('settings')}
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
                primary="Design Settings"
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
              to={getAgentPath('publish')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('publish')
              }
              button={true}
              className={classes.listItem}>
              <ListItemIcon style={{ color: 'white' }}>
                <SubMenuIcon title="Project" active={false} />
              </ListItemIcon>
              <ListItemText
                primary="Publish Assistant"
                style={
                  location.pathname.includes('projects') &&
                  location.pathname.includes('publish')
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
