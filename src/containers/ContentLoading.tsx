import { CircularProgress, Grid } from '@material-ui/core';
import React from 'react';

interface ContentLoadingProps {
  shrinked?: boolean;
}

function ContentLoading({ shrinked }: ContentLoadingProps) {
  return (
    <Grid
      container={true}
      direction="column"
      justify="center"
      alignItems="center"
      style={{
        position: 'absolute',
        width: shrinked ? 'clac(100% - 300px)' : '100%',
        height: '100vh',
        top: '0px',
        left: shrinked ? '200px' : '0px',
      }}>
      <CircularProgress color="secondary" />
    </Grid>
  );
}

export default ContentLoading;
