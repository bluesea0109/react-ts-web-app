import { Grid, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useParams } from 'react-router-dom';
import NewUtteranceAction from './NewUtteranceAction';
import UtteranceActionsTable from './UtteranceActionsTable';

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

const AgentActionsSection: React.FC = () => {
  const classes = useStyles();
  const { agentId } = useParams();

  return (
    <div className={classes.root}>
         <Grid item={true} xs={12} sm={12}>
            <NewUtteranceAction />
          </Grid>
          <Grid item={true} xs={12} sm={12}>
            <Paper className={classes.paper}>
              {agentId ? (
                <UtteranceActionsTable />
              ) : (
                <Typography>{'No Utterance Action is found'}</Typography>
              )}
            </Paper>
          </Grid>

    </div>
  );
};

export default AgentActionsSection;
