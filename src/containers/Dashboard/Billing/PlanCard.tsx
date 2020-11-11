import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    color: 'white',
    height: '250px',
    backgroundColor: '#0f0f69',
    borderRadius: '5px',
    padding: '10px',
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
}));

const BasicPlanCard = () => {
  const classes = useStyles();

  return (
    <Grid container={true} className={classes.root}>
      <Grid style={{ width: '100%' }} item={true}>
        CurrentPlan
      </Grid>
      <Grid style={{ width: '100%' }} className={classes.content}>
        <Typography variant="h4">Bavard Basic Plan</Typography>
      </Grid>
    </Grid>
  );
};

export default BasicPlanCard;
