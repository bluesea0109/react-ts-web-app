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
      padding: theme.spacing(6),
    },
  }),
);

export default function FAQService() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container={true}>
        <Typography style={{fontSize: '26px', marginBottom: '24px'}}>{'Under Construction'}</Typography>
      </Grid>
    </div>
  );
}
