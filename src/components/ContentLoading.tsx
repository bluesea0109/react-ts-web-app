import { CircularProgress, Grid } from '@material-ui/core';
import React from 'react';

function ContentLoading(props: any) {
  return (
    <Grid container={true} direction="column" justify="center" alignItems="center">
      <CircularProgress color="secondary"/>
    </Grid>
  );
}

export default ContentLoading;
