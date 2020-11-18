import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import BillingPeriodData from './BillingPeriodData';
import PaymentHistory from './PaymentHistory';
import BasicPlanCard from './PlanCard';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(6),
    display: 'flex',    
  },
  billData: {
    display: 'flex',
    flexFlow: 'column',
  },
  pageTitle: {
    fontSize: '26px', 
    marginBottom: '24px'
  }
}));

const Billing = () => {
  const classes = useStyles();

  return (
    <Grid container={true} className={classes.root}>
      <Typography variant="h5" className={classes.pageTitle}>Billing</Typography>
      <Grid container={true} spacing={2}>
        <Grid item={true} sm={5} xs={5}>
          <BasicPlanCard />
        </Grid>
        <Grid item={true} sm={7} xs={7} className={classes.billData}>
          <BillingPeriodData />
          <PaymentHistory />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Billing;
