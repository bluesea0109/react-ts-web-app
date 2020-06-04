import { Grid, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useParams } from 'react-router-dom';
import IntentsTable from './IntentsTable';
import NewIntent from './NewIntent';

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

const IntentSection: React.FC = () => {
  const classes = useStyles();
  const { agentId } = useParams();

  return (
    <div className={classes.root}>
          <Grid item={true} xs={12} sm={12}>
            <NewIntent />
          </Grid>
          <Grid item={true} xs={12} sm={12}>
            <Paper className={classes.paper}>
              {agentId ? (
                <IntentsTable />
              ) : (
                <Typography>{'No Intent is found'}</Typography>
              )}
            </Paper>
          </Grid>

    </div>
  );
};

export default IntentSection;
