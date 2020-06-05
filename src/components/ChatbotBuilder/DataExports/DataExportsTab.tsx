import { createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'auto',
      padding: theme.spacing(2),
    },
  }),
);
export default function DataExportsTab() {
  const classes = useStyles();
  let { agentId } = useParams();
  agentId = parseInt(agentId, 10);

  return (
    <div className={classes.root}>
      <Grid container={true} spacing={2}>

      </Grid>
    </div>
  );
}
