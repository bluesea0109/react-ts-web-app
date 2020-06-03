import UploadDataDialog from "./UploadDataDialog";
import { makeStyles, Theme, createStyles, Grid, Typography } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router";
import Highlight from 'react-highlight';
import example from "./example";
import "./highlight-themes/default.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <UploadDataDialog agentId={agentId} />
        </Grid>
        <Grid item xs={12}>
          <Typography>{"You may upload agent data as a JSON file with the following format"}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Highlight className='json'>
            {example}
          </Highlight>
        </Grid>
      </Grid>
    </div>
  )
}