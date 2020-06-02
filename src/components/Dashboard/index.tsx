import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import firebase from 'firebase';
import 'firebase/auth';
import React from 'react';
import { IUser } from '../../models';
import NewOrganisation from './NewOrganisation';
import NewProject from './NewProject';
import ProjectsTable from './ProjectsTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
    },
  }),
);

interface IDashboardProps {
  user: IUser;
}

function Account(props: IDashboardProps) {
  const classes = useStyles();
  const orgId = props.user.activeOrg?.id;
  const firebaseUser = firebase.auth().currentUser;
  if (!firebaseUser) {
    // this shouldn't happen
    console.error('No user signed in');
    return <Typography>{'No user is signed in.'}</Typography>;
  }

  const userName = firebaseUser.displayName;
  let welcomeMsg = `Welcome, back.`;

  if (userName) {
    const firstName = userName.split(' ')[0];
    welcomeMsg = `Welcome, ${firstName}`;
  }

  const orgs = props.user.orgs;
  const activeOrg = props.user.activeOrg;

  return (
    <div className={classes.root}>
      <Grid>
        <Grid item={true} xs={12}>
          <Typography variant="h6">{welcomeMsg}</Typography>
        </Grid>
        <Grid item={true} container={true} xs={12} spacing={2}>
          <Grid item={true} xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography variant="h5">{'Your organizations'}</Typography>
              {orgs ? (
                <TableContainer component={Paper} aria-label="Orgs">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Org id</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orgs.map((org) => (
                        <TableRow key={org.id}>
                          <TableCell>{org.name}</TableCell>
                          <TableCell>{org.id}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography align="center" variant="h6">
                  {'No organizations found'}
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid item={true} xs={12} sm={6}>
            <Paper>
              {activeOrg ? (
                <ProjectsTable
                  activeOrg={activeOrg}
                  activeProject={props.user.activeProject}
                />
              ) : (
                <Typography>{'No organization is active.'}</Typography>
              )}
            </Paper>
          </Grid>
          <Grid item={true} xs={12} sm={6}>
            <NewOrganisation />
          </Grid>
          <Grid item={true} xs={12} sm={6}>
            {orgId ? <NewProject activeOrg={activeOrg} /> : null}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
export default Account;
