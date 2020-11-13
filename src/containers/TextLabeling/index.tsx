import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
  }),
);

export default function TextLabeling() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container={true}>
        <Typography variant="h6">{'Under Construction'}</Typography>
      </Grid>
    </div>
  );
}
