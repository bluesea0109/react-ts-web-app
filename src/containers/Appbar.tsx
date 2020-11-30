import { useMutation } from '@apollo/client';
import { BasicButton, DropDown, TextInput } from '@bavard/react-components';
import { Box, createStyles, Theme } from '@material-ui/core';
import AppBar, { AppBarProps } from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import firebase from 'firebase/app';
import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  GET_CURRENT_USER,
  UPDATE_ACTIVE_WORKSPACE,
} from '../common-gql-queries';
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
    noWorkspace: {
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

interface WorkspacesProps {
  user: IUser;
  updateActiveWorkspace: (workspace: any) => void;
}

const Workspaces: React.FC<WorkspacesProps> = ({
  user,
  updateActiveWorkspace,
}) => {
  const classes = useStyles();

  const setActiveWorkspace = (workspaceId: string) => {
    updateActiveWorkspace({
      variables: {
        workspaceId,
      },
    });
  };

  const workspaces = useMemo(() => {
    return (user.workspaces || []).map((workspace) => ({
      id: workspace.id,
      value: workspace.name,
    }));
  }, [user.workspaces]);

  return workspaces.length !== 0 ? (
    <DropDown
      label="Workspace:"
      labelType="InputLabel"
      labelPosition="top"
      current={user.activeWorkspace?.id || ''}
      menuItems={workspaces}
      onChange={(id) => setActiveWorkspace(id)}
    />
  ) : (
    <TextInput
      id="no-workspace"
      label="Workspace"
      labelType="InputLabel"
      labelPosition="top"
      defaultValue="No Workspace"
      className={classes.noWorkspace}
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
  closeDrawer,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const onLogoutClick = () => {
    firebase.auth().signOut();
  };

  const [updateActiveWorkspace, { loading: loadingWorkspace }] = useMutation(
    UPDATE_ACTIVE_WORKSPACE,
    {
      refetchQueries: [{ query: GET_CURRENT_USER }],
      awaitRefetchQueries: true,
      onCompleted: ({ updateUserActiveWorkspace }) => {
        history.push(
          `/workspaces/${updateUserActiveWorkspace.activeWorkspace.id}/settings`,
        );
        closeDrawer();
      },
    },
  );

  useEffect(() => {
    handleChangeLoadingStatus(loadingWorkspace);
  }, [loadingWorkspace, handleChangeLoadingStatus]);

  return (
    <AppBar
      position={position}
      className={className}
      style={{ boxShadow: 'none' }}>
      <Toolbar>
        <Typography variant="h6" className={classes.title} />
        <Box mr={1}>
          <Workspaces
            user={user}
            updateActiveWorkspace={updateActiveWorkspace}
          />
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
