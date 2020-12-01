import { ActionDialog, Button, CommonTable } from '@bavard/react-components';
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
import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useState } from 'react';
import { IUser, IWorkspace } from '../../models/user-service';
import { DELETE_WORKSPACE, GET_CURRENT_USER } from '../../common-gql-queries';
import NewWorkspace from './NewWorkspace';
import DeleteWorkspace from './DeleteWorkspace';

interface IDashboardProps {
  user: IUser;
}

const Dashboard: React.FC<IDashboardProps> = ({ user }) => {
  const firebaseUser = firebase.auth().currentUser;
  const classes = useStyles();
  const [currentWorkspace, setCurrentWorkspace] = useState<IWorkspace>();
  const [showAddWorkspace, setShowAddWorkspace] = useState(false);
  const [showDeleteWorkspace, setShowDeleteWorkspace] = useState(false);
  const [deleteWorkspace] = useMutation(DELETE_WORKSPACE, {
    refetchQueries: [
      {
        query: GET_CURRENT_USER,
      },
    ],
    awaitRefetchQueries: true,
  });

  if (!firebaseUser) {
    // this shouldn't happen
    console.error('No user signed in');
    return <Typography>{'No user is signed in.'}</Typography>;
  }

  const workspaces = user.workspaces;
  const columns = [
    { title: 'Name', field: 'name' },
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

  const handleCloseWorkspace = () => {
    setCurrentWorkspace(undefined);
    setShowDeleteWorkspace(false);
  };

  const handleShowWorkspace = (workspace: IWorkspace) => {
    setCurrentWorkspace(workspace);
    setShowDeleteWorkspace(true);
  };

  const handleDeleteWorkspace = (rowData: IWorkspace) => {
    deleteWorkspace({
      variables: { workspaceId: rowData.id },
    });
    handleCloseWorkspace();
  };

  return (
    <div className={'page-container'}>
      <Grid style={{ marginTop: '20px' }}>
        <Grid item={true} container={true} xs={12} spacing={4}>
          <Grid item={true} sm={12} md={10}>
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
                    title={<h4>Your Workspaces</h4>}
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
                  />
                ),
              }}
            />
          </Grid>

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
}));

export default Dashboard;
