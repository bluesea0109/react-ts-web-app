import { createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import Highlight from 'react-highlight';
import { useParams } from 'react-router';
import example from './example';
import './highlight-themes/default.css';
import UploadDataDialog from './UploadDataDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflow: 'auto',
      padding: theme.spacing(2),
    },
  }),
);
export default function UploadDataTab() {
  const classes = useStyles();
  let { agentId } = useParams();
  agentId = parseInt(agentId, 10);

  return (
    <div className={classes.root}>
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <UploadDataDialog agentId={agentId} />
        </Grid>
        <Grid item={true} xs={12}>
          <Typography>{'You may upload agent data as a JSON file with the following format'}</Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <Highlight className="json">
            {example}
          </Highlight>
        </Grid>
      </Grid>
    </div>
  );
}
