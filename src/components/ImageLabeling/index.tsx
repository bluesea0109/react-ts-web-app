import { makeStyles, Grid, Typography, Toolbar, Theme, createStyles } from '@material-ui/core';
import React from "react";
import Collections from './Collections';
import CreateCollection from './CreateCollection';
import { useActiveOrg } from '../UseActiveOrg';

interface IProjectProps {
  orgId: string,
  projectId: string,
}

function ImageLabelingPageWrapper() {
  const { orgId, projectId } = useActiveOrg();

  if (!orgId) {
    return <Typography>{"No org is active."}</Typography>
  }
  if (!projectId) {
    return <Typography>{"No project is active."}</Typography>
  }

  return <ImageLabelingPage orgId={orgId} projectId={projectId} />
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
    },
  })
);

function ImageLabelingPage(props: IProjectProps) {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Toolbar variant="dense" disableGutters={true} className={classes.toolbar}>
          <Typography variant="h6">
            {"Collections"}
          </Typography>
          <CreateCollection/>
        </Toolbar>
      </Grid>
      <Grid container item xs={12}>
        <Collections />
      </Grid>
    </Grid>
  );
};

export default ImageLabelingPageWrapper;
