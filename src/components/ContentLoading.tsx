import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';

function ContentLoading(props: any) {
  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <CircularProgress color="secondary"/>
    </Grid>
  );
};

export default ContentLoading;
