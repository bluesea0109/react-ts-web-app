import { CommonTable, Switch } from '@bavard/react-components';
import {
  Button,
  CardHeader,
  Dialog,
  Grid,
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
import NewWorkspace from './NewWorkspace';
import { DELETE_WORKSPACE, GET_CURRENT_USER } from '../../common-gql-queries';

interface IDashboardProps {
  user: IUser;
}

function Account(props: IDashboardProps) {
  const firebaseUser = firebase.auth().currentUser;
  const [viewAddWorkspace, showAddWorkspace] = useState(false);
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

  const workspaces = props.user.workspaces;
  const columns = [
    { title: 'Name', field: 'name' },
    {
      title: 'Status',
      field: 'billingEnabled',
      renderRow: (workspace: IWorkspace) => (
        <Switch
          checked={workspace.billingEnabled}
          onChange={(billingEnabled: boolean) => {
            // onUpdateBilling(workspace, billingEnabled);
          }}
        />
      ),
    },
  ];

  const handleDeleteWorkspace = (rowData: IWorkspace) => {
    deleteWorkspace({
      variables: { workspaceId: rowData.id },
    });
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
              editable={{
                isDeleteable: true,
                onRowDelete: handleDeleteWorkspace,
              }}
              components={{
                Toolbar: () => (
                  <CardHeader
                    avatar={<SupervisedUserCircleOutlined />}
                    title={<h4>Your Workspaces</h4>}
                    action={
                      <Button
                        color="primary"
                        onClick={() => showAddWorkspace(true)}
                        endIcon={<AddCircleOutline />}
                        disabled={(workspaces?.length || 0) >= 3}>
                        Add New Workspace
                      </Button>
                    }
                  />
                ),
              }}
            />
          </Grid>

          <Grid item={true} xs={12} sm={6}>
            {viewAddWorkspace && (
              <Dialog
                title="Add an Workspace"
                open={true}
                onClose={() => showAddWorkspace(false)}>
                <NewWorkspace onSuccess={() => showAddWorkspace(false)} />
              </Dialog>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
export default Account;
