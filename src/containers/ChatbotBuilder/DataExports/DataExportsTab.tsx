import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import DataExportsTable from './DataExportsTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflow: 'auto',
      padding: '50px',
    },
    pageTitle: {
      fontSize: '26px',
      marginBottom: '24px',
    },
  }),
);
export default function DataExportsTab() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container={true} spacing={2}>
        <Grid className={classes.pageTitle}>Data Exports</Grid>
        <DataExportsTable />
      </Grid>
    </div>
  );
}
