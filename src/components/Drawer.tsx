import { createStyles, Theme } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SubMenuIcon from '../components/IconButtons/SubMenuIcon';
import { IAgentParam } from '../models/chatbot-service';
import { IUser } from '../models/user-service';



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
  agent: IAgentParam;
}

function CustomDrawer(props: CustomDrawerProps) {
  const { user, navigation, agent } = props;
  const classes = useStyles();
  const location = useLocation();  

  const selectedStyle = {
    backgroundColor: '#4A90E2',
    padding: '10px',
    borderRadius: '5px',
    wordwrap: 'normal',
  };

  const createPath = (pageName: string): string => {
    if (!user.activeProject) {
      return '/no-project';
    }
    return `/orgs/${user.activeProject.orgId}/projects/${user.activeProject.id}/${pageName}`;
  };

  const createAgentPath = (agentTab: string): string => {
    if (!user.activeProject) {
      return '/no-project';
    }    
    return `/orgs/${user.activeProject.orgId}/projects/${user.activeProject.id}/chatbot-builder/agents/${agent.agentId}/${agentTab}`;
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
                  (location.pathname.includes('settings') || location.pathname.includes('/'))
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
              to={''}
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
                  location.pathname.includes('chatbot-builder') ? selectedStyle : {}
                }
              />
            </ListItem>
          </List>
        )
      case 6:
        return (
          <List>
            <ListItem className={classes.blank} />
            <ListItem
              component={Link}
              to={createAgentPath('Actions')}
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
              to={createAgentPath('Intents')}
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
              to={createAgentPath('Tags')}
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
              to={createAgentPath('Slots')}
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
              to={createAgentPath('graph-policy')}
              selected={
                location.pathname.includes('projects') &&
                location.pathname.includes('graph-policy')
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
                  location.pathname.includes('graph-policy')
                    ? selectedStyle
                    : {}
                }
              />
            </ListItem>
          </List>
        );
      case 7:        
        return (
          <List>
            <ListItem className={classes.blank} />
            <ListItem
              component={Link}
              to={createAgentPath('training-jobs')}
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
              to={createAgentPath('live-conversations')}
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
                primary="Training Conversation"
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
              to={createAgentPath('nluExamples')}
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
          </List>
        );
      case 8:
        return (
          <List>
            <ListItem className={classes.blank} />
            <ListItem
              component={Link}
              to={createAgentPath('chats')}
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
              to={createAgentPath('upload-data')}
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
              to={createAgentPath('exports')}
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
              to={createAgentPath('settings')}
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
              to={createAgentPath('publish')}
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
