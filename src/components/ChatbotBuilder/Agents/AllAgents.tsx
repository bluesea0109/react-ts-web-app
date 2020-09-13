import { Grid, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { IUser } from '../../../models/user-service';
import AgentsTable from './AgentsTable';
import NewAgent from './NewAgent';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      overflow: 'auto',
    },
    paper: {
      padding: theme.spacing(2),
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
    <div className={classes.root}>
      <Grid>
          <Grid item={true} xs={12} sm={12}>
            <NewAgent user={user} />
          </Grid>
          <Grid item={true} xs={12} sm={12}>
            <Paper>
              {activeProj ? (
                <AgentsTable />
              ) : (
                <Typography>{'No project is active'}</Typography>
              )}
            </Paper>
          </Grid>
      </Grid>
    </div>
  );
};

export default AllAgents;
