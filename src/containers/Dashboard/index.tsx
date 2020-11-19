import {
  Button,
  Card,
  CardHeader,
  Dialog,
  Grid,
  Typography,
} from '@material-ui/core';
import {
  AddCircleOutline,
  Folder,
  SupervisedUserCircleOutlined,
} from '@material-ui/icons';
import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useState } from 'react';
import { IUser } from '../../models/user-service';
import NewOrganisation from './NewOrganisation';
import NewProject from './NewProject';
import ProjectsTable from './ProjectsTable';
import { CommonTable } from '../../components';

interface IDashboardProps {
  user: IUser;
}

function Account(props: IDashboardProps) {
  const orgId = props.user.activeOrg?.id;
  const firebaseUser = firebase.auth().currentUser;
  const [viewAddOrg, showAddOrg] = useState(false);
  const [viewAddProject, showAddProject] = useState(false);

  if (!firebaseUser) {
    // this shouldn't happen
    console.error('No user signed in');
    return <Typography>{'No user is signed in.'}</Typography>;
  }

  const orgs = props.user.orgs;
  const activeOrg = props.user.activeOrg;
  const columns = [
    { title: 'Organization Name', field: 'name' },
    { title: 'Organization Id', field: 'id' },
  ];

  return (
    <div className={'page-container'}>
      <Grid style={{marginTop: '20px'}}>
        <Grid item={true} container={true} xs={12} spacing={4}>
          <Grid item={true} sm={12} md={10}>
            <Grid item={true} style={{ fontSize: '26px', marginBottom: '24px'}}>
              Dashboard
            </Grid>
            <CommonTable
              data={{
                columns,
                rowsData: orgs || [],
              }}
              components={{
                Toolbar: () => (
                  <CardHeader
                    avatar={<SupervisedUserCircleOutlined />}
                    title={<h4>Your organizations</h4>}
                    action={
                      <Button
                        color="primary"
                        onClick={() => showAddOrg(true)}
                        endIcon={<AddCircleOutline />}
                        disabled={(orgs?.length || 0) >= 3}>
                        Add New Organization
                      </Button>
                    }
                  />
                ),
              }}
            />
          </Grid>
          <Grid item={true} sm={12} md={10}>
            <Card>
              <CardHeader
                avatar={<Folder />}
                title={<h4>Projects for {activeOrg?.name}</h4>}
                action={
                  <Button
                    color="primary"
                    onClick={() => showAddProject(true)}
                    endIcon={<AddCircleOutline />}>
                    Add New Project
                  </Button>
                }
              />
              {activeOrg ? (
                <ProjectsTable
                  activeOrg={activeOrg}
                  activeProject={props.user.activeProject}
                />
              ) : (
                <Typography>{'No organization is active.'}</Typography>
              )}
            </Card>
          </Grid>

          <Grid item={true} xs={12} sm={6}>
            {viewAddOrg && (
              <Dialog
                title="Add an Organization"
                open={true}
                onClose={() => showAddOrg(false)}>
                <NewOrganisation onSuccess={() => showAddOrg(false)} />
              </Dialog>
            )}
            {viewAddProject && orgId && (
              <Dialog
                title="Create a Project"
                open={true}
                onClose={() => showAddProject(false)}>
                <NewProject
                  activeOrg={activeOrg}
                  onSuccess={() => showAddProject(false)}
                />
              </Dialog>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
export default Account;
