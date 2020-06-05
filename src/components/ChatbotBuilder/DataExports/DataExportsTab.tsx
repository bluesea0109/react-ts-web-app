import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import DataExportsTable from './DataExportsTable';

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

  return (
    <div className={classes.root}>
      <Grid container={true} spacing={2}>
        <DataExportsTable />
      </Grid>
    </div>
  );
}
