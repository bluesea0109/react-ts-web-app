import { useMutation } from '@apollo/react-hooks';
import {
  CircularProgress,
  createStyles,
  IconButton,
  Theme,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import AppBar, { AppBarProps } from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import firebase from 'firebase/app';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GET_CURRENT_USER, UPDATE_ACTIVE_ORG } from '../gql-queries';
import { IUser } from '../models';

interface CustomAppbarProps extends AppBarProps {
  onMenuClick: () => void;
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
      background: 'primary',
      color: 'white',
      borderRadius: 4,
      borderColor: 'white',
    },
    selectLabel: {
      color: 'white',
    },
    icon: {
      fill: 'white',
    },
    border: {
      borderBottom: '1px solid white',
    },
  })
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
    updateActiveOrg({
      variables: { orgId },
    });
  };

  return loading ? (
    <CircularProgress color="secondary" />
  ) : (
    <FormControl>
      <InputLabel className={clsx(classes.selectLabel)} id="select-active-org">
        Org
      </InputLabel>
      <Select
        labelId="select-active-org"
        value={user.activeOrg?.id ?? ''}
        onChange={(e) => setActiveOrg(e.target.value as string)}
        className={clsx([classes.selectInput, classes.menuButton])}
        inputProps={{
          classes: {
            root: classes.border,
            icon: classes.icon,
          },
        }}
      >
        {user.orgs.map((org: any) => (
          <MenuItem key={org.id} value={org.id}>
            {org.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const Projects: React.FC<{ user: IUser }> = ({ user }) => {
  const projects = user?.activeOrg?.projects;

  const classes = useStyles();
  const history = useHistory();
  const [projectId, setProjectId] = useState(user.activeProject?.id ?? '');

  const [updateActiveProject, { loading }] = useMutation(UPDATE_ACTIVE_ORG, {
    refetchQueries: [{ query: GET_CURRENT_USER }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      history.push('/');
    },
  });

  const setActiveProject = async (projectId: string) => {
    await updateActiveProject({
      variables: { projectId, orgId: user?.activeOrg?.id },
    });

    setProjectId(projectId);
  };

  if (loading) return <CircularProgress color="secondary" />;

  return projects?.length !== 0 ? (
    <FormControl className={clsx(classes.menuButton)}>
      <InputLabel
        className={clsx(classes.selectLabel)}
        id="select-active-project"
      >
        Project
      </InputLabel>
      <Select
        labelId="select-active-project"
        value={projectId}
        onChange={(e) => setActiveProject(e.target.value as string)}
        className={clsx(classes.selectInput)}
        inputProps={{
          classes: {
            root: classes.border,
            icon: classes.icon,
          },
        }}
      >
        {projects?.map((project) => (
          <MenuItem key={project.id} value={project.id}>
            {project.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : null;
};

const CustomAppbar: React.FC<CustomAppbarProps> = ({
  user,
  position,
  className,
  onMenuClick,
}) => {
  const classes = useStyles();

  const onLogoutClick = () => {
    firebase.auth().signOut();
  };

  return (
    <AppBar position={position} className={className}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {'Bavard AI'}
        </Typography>
        <Orgs user={user} />
        <Projects user={user} />
        <Button onClick={onLogoutClick} color="inherit">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppbar;
