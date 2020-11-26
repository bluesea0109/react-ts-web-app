import { CommonTable } from '@bavard/react-components';
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
import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useState } from 'react';
import { IUser } from '../../models/user-service';
import NewWorkspace from './NewWorkspace';

interface IDashboardProps {
  user: IUser;
}

function Account(props: IDashboardProps) {
  const firebaseUser = firebase.auth().currentUser;
  const [viewAddWorkspace, showAddWorkspace] = useState(false);

  if (!firebaseUser) {
    // this shouldn't happen
    console.error('No user signed in');
    return <Typography>{'No user is signed in.'}</Typography>;
  }

  const workspaces = props.user.workspaces;
  const columns = [
    { title: 'Workspace Name', field: 'name' },
    { title: 'Workspace Id', field: 'id' },
  ];

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
