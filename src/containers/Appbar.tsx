import { useMutation } from '@apollo/client';
import {
  Box,
  CircularProgress,
  createStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import AppBar, { AppBarProps } from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import firebase from 'firebase/app';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { GET_CURRENT_USER, UPDATE_ACTIVE_ORG } from '../common-gql-queries';
import { DropDown } from '../components';
import { IUser } from '../models/user-service';

interface CustomAppbarProps extends AppBarProps {
  user: IUser;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    selectInput: {
      minWidth: 90,
      background: 'primary',
      color: 'black',
      borderRadius: 4,
      borderColor: 'white',
    },
    selectLabel: {
      color: 'black',
    },
    icon: {
      fill: 'black',
    },
    border: {
      borderBottom: '1px solid black',
    },
    noProject: {
      width: 100,
      marginLeft: 10,
      '& label': {
        color: '#000',
      },
      '& .MuiInputBase-root': {
        color: '#000',
        '&::before': {
          borderBottomColor: '#000',
        },
      },
    },
  }),
);

const Orgs: React.FC<{ user: IUser }> = ({ user }) => {
  const classes = useStyles();
  const history = useHistory();

  const [updateActiveOrg, { loading }] = useMutation(UPDATE_ACTIVE_ORG, {
    refetchQueries: [{ query: GET_CURRENT_USER }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      history.push('/'); // back to dashboard. TODO: keep the user on their current tab.
    },
  });

  const setActiveOrg = (orgId: string) => {
    const org = user.orgs?.find((org) => org.id === orgId);
    const projects = org?.projects;
    const projectId = projects?.[0]?.id;
    updateActiveOrg({
      variables: {
        orgId,
        ...projectId && { projectId },
      },
    });
  };

  if (loading) { return <CircularProgress color="secondary" />; }
  const orgs = user.orgs ?? [];
  return orgs?.length !== 0 ? (
    <DropDown
      label="Organization:"
      current={user.activeOrg?.id}
      menuItems={orgs}
      onChange={(name) => setActiveOrg(name)}
    />
  ) : (
    <TextField
      className={classes.noProject}
      id="no-org"
      label="Org"
      defaultValue=" No Org"
      InputProps={{
        readOnly: true,
      }}
    />
  );
};

const Projects: React.FC<{ user: IUser }> = ({ user }) => {
  const projects = user?.activeOrg?.projects || [];
  const projectId = user.activeProject?.id ?? '';
  const classes = useStyles();
  const history = useHistory();

  const [updateActiveProject, { loading }] = useMutation(UPDATE_ACTIVE_ORG, {
    refetchQueries: [{ query: GET_CURRENT_USER }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      history.push('/');
    },
  });

  const setActiveProject = (projectId: string) => {
    updateActiveProject({
      variables: { projectId, orgId: user?.activeOrg?.id },
    });
  };

  if (loading) { return <CircularProgress color="secondary" />; }

  return projects?.length !== 0 ? (
    <DropDown
      label="Project:"
      current={projectId}
      menuItems={projects}
      onChange={(name) => setActiveProject(name)}
    />
  ) : (
    <TextField
      className={classes.noProject}
      id="no-project"
      label="Project"
      defaultValue=" No Project"
      InputProps={{
        readOnly: true,
      }}
    />
  );
};

const CustomAppbar: React.FC<CustomAppbarProps> = ({
  user,
  position,
  className,
}) => {
  const classes = useStyles();

  const onLogoutClick = () => {
    firebase.auth().signOut();
  };

  return (
    <AppBar position={position} className={className}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}/>
        <Box mr={1}>
          <Orgs user={user} />
        </Box>
        <Box>
          <Projects user={user} />
        </Box>
        <Button onClick={onLogoutClick} color="inherit">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppbar;
