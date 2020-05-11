import { Grid, Typography } from '@material-ui/core';
import React from "react";
import { withActiveOrg } from "../WithActiveOrg";
import Collections from './Collections';

interface IProjectProps {
  orgId: string,
  projectId: string | null,
}

function ImageLabelingPageWrapper(props: IProjectProps) {
  if (!props.projectId) {
    return <Typography>{"No project is active."}</Typography>
  }
  return <ImageLabelingPage {...props} />
}

function ImageLabelingPage(props: IProjectProps) {
  return (
    <Grid container spacing={2}>
      <Typography>{"Collections"}</Typography>
      <Collections />
    </Grid>
  );
};

export default withActiveOrg(ImageLabelingPageWrapper);
