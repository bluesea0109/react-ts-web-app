import { Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import 'firebase/auth';
import React, { useState } from 'react';
import { useActiveOrg } from '../UseActiveOrg';
import NewOrganisation from './NewOrganisation';
import NewProject from './NewProject';
import Orgs from './Orgs';
import Projects from './Projects';
import { IAccountProps } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
  })
);

const Account: React.FC<IAccountProps> = ({ user }) => {
  const classes = useStyles();
  const { orgId } = useActiveOrg();
  const [activeOrg, setActiveOrg] = useState<string | null | undefined>(
    orgId ?? user?.activeOrg?.id
  );

  return (
    <>
      <Typography variant="h4">{'Accounts section'}</Typography>
      <div className={classes.root}>
        <Grid container={true} spacing={2}>
          <Grid item={true} xs={12} sm={6}>
            {orgId ? <NewProject /> : null}
          </Grid>
          <Grid item={true} xs={12} sm={6}>
            <NewOrganisation />
          </Grid>
          <Grid item={true} xs={12} sm={6}>
            <Projects />
          </Grid>
          <Grid item={true} xs={12} sm={6}>
            <Orgs />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Account;
