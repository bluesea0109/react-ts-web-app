import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
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
    toolbarActions: {
      float: 'right',
    },
    pageTitle: {
      fontSize: '26px',
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(1),
    },
  }),
);
export default function TrainingJobsTab() {
  const classes = useStyles();
  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);

  return (
    <div className={'page-container'}>
      <Typography className={classes.pageTitle} variant="h6">
        Training Information
      </Typography>

      <Grid container={true} spacing={2}>
        <Grid item={true} xs={6}>
          <TrainingJobsTable
            toolbarActions={
              <CreateTrainingJobDialog
                className={classes.toolbarActions}
                agentId={agentId}
              />
            }
          />
        </Grid>
        <Grid item={true} xs={6}>
          <AgentModelTable />
        </Grid>
      </Grid>
    </div>
  );
}
