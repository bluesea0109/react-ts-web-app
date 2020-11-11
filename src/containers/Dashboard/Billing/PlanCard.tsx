import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    color: 'white',
    height: '300px',
    backgroundColor: '#0f0f69',
    borderRadius: '5px',
    padding: '10px',
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: '20px',
    flexFlow: 'column',
  },
  button: {
    marginTop: '20px',
    backgroundColor: 'white',
    width: '128px',
    padding: '15px 30px',
    color: 'blue',
    margin: 'auto',
    borderRadius: '3px',
    cursor: 'pointer',
  },
}));

const BasicPlanCard = () => {
  const classes = useStyles();

  return (
    <Grid className={classes.root}>
      <Grid style={{ width: '100%' }} item={true}>
        CurrentPlan
      </Grid>
      <Grid style={{ width: '100%', marginBottom: '20px' }} className={classes.content}>
        <Typography variant="h4" style={{ marginBottom: '20px' }}>Bavard Basic Plan</Typography>
        <Typography variant="h6" style={{ marginBottom: '20px' }}>
          Two organizations with three chatbots each.
        </Typography>
        <Typography variant="h6">$300 /</Typography>
        <Typography>month</Typography>
        <UpgradeButton />
      </Grid>
    </Grid>
  );
};

const UpgradeButton = () => {
  const classes = useStyles();
  return <div className={classes.button}>Upgrade</div>;
};

export default BasicPlanCard;
