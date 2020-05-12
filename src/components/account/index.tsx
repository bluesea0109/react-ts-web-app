import { Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import 'firebase/auth';
import React from 'react';
import NewOrganisation from './NewOrganisation';
import NewProject from './NewProject';
import Projects from './Projects';
import Orgs from './Orgs';
import { useActiveOrg } from '../UseActiveOrg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
  })
);

function Account() {
  const classes = useStyles();
  const { orgId } = useActiveOrg();

  return (
    <>
      <Typography variant="h4">{'Accounts section'}</Typography>
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <NewOrganisation />
          </Grid>
          <Grid item xs={12} sm={6}>
            {orgId ? <NewProject /> : null}
          </Grid>
          <Grid item xs={12} sm={12}>
            <Projects />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Orgs />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
export default Account;
