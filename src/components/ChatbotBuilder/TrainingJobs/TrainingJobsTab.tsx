import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router';
import CreateTrainingJobDialog from './CreateTrainingJobDialog';
import TrainingJobsTable from './TrainingJobsTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
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
        <Grid item={true} xs={6}>
          <CreateTrainingJobDialog agentId={agentId} />
        </Grid>
      </Grid>
      <Grid container={true}>
        <TrainingJobsTable />
      </Grid>
    </div>
  );
}
