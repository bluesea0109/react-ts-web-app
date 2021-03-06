import {
  ActionDialog,
  Button,
  CommonTable,
  Switch,
} from '@bavard/react-components';
import {
  Box,
  CardHeader,
  makeStyles,
  Grid,
  Theme,
  Typography,
} from '@material-ui/core';
import {
  AddCircleOutline,
  SupervisedUserCircleOutlined,
} from '@material-ui/icons';
import { useMutation } from '@apollo/client';
import { getIdToken } from '../../apollo-client';
import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import NewWorkspace from './NewWorkspace';
import DeleteWorkspace from './DeleteWorkspace';
import WorkspaceSettings from './WorkspaceSettings';

import { IUser, IWorkspace } from '../../models/user-service';
import {
  DELETE_WORKSPACE,
  GET_CURRENT_USER,
  UPDATE_ACTIVE_WORKSPACE,
} from '../../common-gql-queries';
import ApolloErrorPage from '../ApolloErrorPage';

interface IDashboardProps {
  user: IUser;
}

const Dashboard: React.FC<IDashboardProps> = ({ user }) => {
  const classes = useStyles();
  const firebaseUser = firebase.auth().currentUser;

  const [currentWorkspace, setCurrentWorkspace] = useState<IWorkspace>();
  const [showAddWorkspace, setShowAddWorkspace] = useState(false);
  const [showDeleteWorkspace, setShowDeleteWorkspace] = useState(false);

  const [deleteWorkspace, deleteWorkspaceResult] = useMutation(
    DELETE_WORKSPACE,
    {
      refetchQueries: [
        {
          query: GET_CURRENT_USER,
        },
      ],
      awaitRefetchQueries: true,
    },
  );

  const [updateActiveWorkspace, updateWorkspaceResult] = useMutation(
    UPDATE_ACTIVE_WORKSPACE,
    {
      refetchQueries: [{ query: GET_CURRENT_USER }],
      awaitRefetchQueries: true,
      onCompleted: ({ updateUserActiveWorkspace }) => {
        localStorage.clear();
        sessionStorage.clear();
        getIdToken();
      },
    },
  );

  if (!firebaseUser) {
    return <Typography>{'No user is signed in.'}</Typography>;
  }

  const handleCloseWorkspace = () => {
    setCurrentWorkspace(undefined);
    setShowDeleteWorkspace(false);
  };

  const handleShowWorkspace = (workspace: IWorkspace) => {
    setCurrentWorkspace(workspace);
    setShowDeleteWorkspace(true);
  };

  const handleDeleteWorkspace = (workspace: IWorkspace) => {
    deleteWorkspace({
      variables: { workspaceId: workspace.id },
    });
    handleCloseWorkspace();
  };

  const handleActivateWorkspace = (workspace: IWorkspace) => {
    updateActiveWorkspace({
      variables: {
        workspaceId: workspace.id,
      },
    });
  };

  const workspaces = user.workspaces;
  const columns = [
    { title: 'Name', field: 'name' },
    {
      title: 'Status',
      field: 'billingEnabled',
      renderRow: (workspace: IWorkspace) => (
        <Switch
          checked={user.activeWorkspace?.id === workspace.id}
          onChange={() => handleActivateWorkspace(workspace)}
        />
      ),
    },
    {
      title: 'Actions',
      field: '',
      renderRow: (workspace: IWorkspace) => (
        <Box display="flex" justifyContent="flex-end">
          <Button
            title="Delete Workspace"
            variant="text"
            className={classes.redButton}
            onClick={() => handleShowWorkspace(workspace)}
          />
        </Box>
      ),
    },
  ];

  const commonError =
    deleteWorkspaceResult.error || updateWorkspaceResult.error;
  if (commonError) {
    return <ApolloErrorPage error={commonError} />;
  }

  return (
    <div className={'page-container'}>
      <Grid style={{ marginTop: '20px' }}>
        <Grid item={true} container={true} xs={12} spacing={4}>
          <Grid item={true} xs={12} sm={10}>
            <Grid
              item={true}
              style={{ fontSize: '26px', marginBottom: '24px' }}>
              Dashboard
            </Grid>
            <CommonTable
              data={{
                columns,
                rowsData: workspaces || [],
              }}
              visibilities={{
                showHeader: false,
              }}
              components={{
                Toolbar: () => (
                  <CardHeader
                    avatar={<SupervisedUserCircleOutlined />}
                    title={
                      <Typography variant="h6">Your Workspaces</Typography>
                    }
                    action={
                      <Button
                        color="primary"
                        title="Add New Workspace"
                        variant="text"
                        disabled={(workspaces?.length || 0) >= 3}
                        RightIcon={AddCircleOutline}
                        onClick={() => setShowAddWorkspace(true)}
                      />
                    }
                    className={classes.cardHeader}
                  />
                ),
              }}
            />
          </Grid>

          {workspaces?.length ? (
            <Grid item={true} xs={12} sm={12}>
              <WorkspaceSettings
                user={user}
                workspaceId={user.activeWorkspace?.id}
              />
            </Grid>
          ) : null}

          <Grid item={true} xs={12} sm={6}>
            {showAddWorkspace && (
              <ActionDialog
                isOpen={true}
                onClose={() => setShowAddWorkspace(false)}>
                <NewWorkspace onSuccess={() => setShowAddWorkspace(false)} />
              </ActionDialog>
            )}
            {showDeleteWorkspace && currentWorkspace && (
              <ActionDialog
                isOpen={true}
                onClose={() => setShowDeleteWorkspace(false)}>
                <DeleteWorkspace
                  workspace={currentWorkspace}
                  onCancel={handleCloseWorkspace}
                  onConfirm={() => handleDeleteWorkspace(currentWorkspace)}
                />
              </ActionDialog>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  redButton: {
    color: '#FF0000',
  },
  cardHeader: {
    '& .MuiCardHeader-action': {
      marginTop: 0,
    },
  },
}));

export default Dashboard;
