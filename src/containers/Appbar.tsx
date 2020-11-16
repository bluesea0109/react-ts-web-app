import { useMutation } from '@apollo/client';
import { Box, createStyles, TextField, Theme } from '@material-ui/core';
import AppBar, { AppBarProps } from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import firebase from 'firebase/app';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { GET_CURRENT_USER, UPDATE_ACTIVE_ORG } from '../common-gql-queries';
import { BasicButton, DropDown } from '../components';
import { IUser } from '../models/user-service';

interface CustomAppbarProps extends AppBarProps {
  user: IUser;
  handleChangeLoadingStatus: (loading: boolean) => void;
  closeDrawer: () => void;
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

interface OrgsProps {
  user: IUser;
  updateActiveOrg: (org: any) => void;
}

const Orgs: React.FC<OrgsProps> = ({ user, updateActiveOrg }) => {
  const classes = useStyles();

  const setActiveOrg = (orgId: string) => {
    const org = user.orgs?.find((org) => org.id === orgId);
    const projects = org?.projects;
    const projectId = projects?.[0]?.id;
    updateActiveOrg({
      variables: {
        orgId,
        ...(projectId && { projectId }),
      },
    });
  };

  const orgs = user.orgs ?? [];
  return orgs?.length !== 0 ? (
    <DropDown
      label="Organization:"
      labelPosition="top"
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

interface ProjectsProps {
  user: IUser;
  updateActiveProject: (project: any) => void;
}
const Projects: React.FC<ProjectsProps> = ({ user, updateActiveProject }) => {
  const projects = user?.activeOrg?.projects || [];
  const projectId = user.activeProject?.id ?? '';
  const classes = useStyles();

  const setActiveProject = (projectId: string) => {
    updateActiveProject({
      variables: { projectId, orgId: user?.activeOrg?.id },
    });
  };

  return projects?.length !== 0 ? (
    <DropDown
      label="Project:"
      labelPosition="top"
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
  handleChangeLoadingStatus,
  closeDrawer
}) => {
  const classes = useStyles();
  const history = useHistory();

  const onLogoutClick = () => {
    firebase.auth().signOut();
  };

  const [updateActiveOrg, { loading: loadingOrganization }] = useMutation(
    UPDATE_ACTIVE_ORG,
    {
      refetchQueries: [{ query: GET_CURRENT_USER }],
      awaitRefetchQueries: true,
      onCompleted: ({ updateUserActiveOrg }) => {
        history.push(`/orgs/${updateUserActiveOrg.activeOrg.id}/settings`);
        closeDrawer();
      },
    },
  );

  const [updateActiveProject, { loading: loadingProject }] = useMutation(
    UPDATE_ACTIVE_ORG,
    {
      refetchQueries: [{ query: GET_CURRENT_USER }],
      awaitRefetchQueries: true,
      onCompleted: ({ updateUserActiveOrg }) => {
        history.push(
          `/orgs/${updateUserActiveOrg.activeOrg.id}/projects/${updateUserActiveOrg.activeProject.id}/settings`,
        );
        closeDrawer();
      },
    },
  );

  useEffect(() => {
    handleChangeLoadingStatus(loadingOrganization || loadingProject);
  }, [loadingOrganization, loadingProject, handleChangeLoadingStatus]);

  return (
    <AppBar
      position={position}
      className={className}
      style={{ boxShadow: 'none' }}>
      <Toolbar>
        <Typography variant="h6" className={classes.title} />
        <Box mr={1}>
          <Orgs user={user} updateActiveOrg={updateActiveOrg} />
        </Box>
        <Box mr={2}>
          <Projects user={user} updateActiveProject={updateActiveProject} />
        </Box>
        <Box>
          <BasicButton
            title="Log out"
            textTransform="none"
            onClick={onLogoutClick}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppbar;
