import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router';
import AgentModelTable from './AgentModelTable';
import CreateTrainingJobDialog from './CreateTrainingJobDialog';
import TrainingJobsTable from './TrainingJobsTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflow: 'auto',
      padding: theme.spacing(2),
    },
  }),
);
export default function TrainingJobsTab() {
  const classes = useStyles();
  let { agentId } = useParams();
  agentId = Number(agentId);
  return (
    <div className={classes.root}>
      <Grid container={true}>
        <Grid item={true}>
          <CreateTrainingJobDialog agentId={agentId} />
        </Grid>
      </Grid>
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={6}>
          <TrainingJobsTable />
        </Grid>
        <Grid item={true} xs={6}>
          <AgentModelTable />
        </Grid>
      </Grid>
    </div>
  );
}
