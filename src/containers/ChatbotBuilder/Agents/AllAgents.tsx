import { Card, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { IUser } from '../../../models/user-service';
import AgentsTable from './AgentsTable';
import NewAgent from './NewAgent';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageTitle: {
      marginBottom: theme.spacing(3),
    },
    gridRow: {
      marginBottom: theme.spacing(3),
    },

  }),
);

interface IChatbotBuilderAgentProps {
  user: IUser;
}

const AllAgents: React.FC<IChatbotBuilderAgentProps> = ({ user }) => {
  const classes = useStyles();
  const activeProj = user.activeProject;

  return (
    <div className="page-container">
      <Typography className={classes.pageTitle} variant="h5">
        Assistant Builder
      </Typography>
      <Grid xs={10}>
        <Grid item={true} xs={12} sm={12} className={classes.gridRow}>
          <NewAgent user={user} />
        </Grid>
        <Grid item={true} xs={12} sm={12}>
          <Card>{activeProj && <AgentsTable />}</Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AllAgents;
