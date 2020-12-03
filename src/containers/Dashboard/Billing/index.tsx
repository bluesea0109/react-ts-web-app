import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import BillingPeriodData from './BillingPeriodData';
import PaymentHistory from './PaymentHistory';
import BasicPlanCard from './BasicPlanCard';
import PremiumPlanCard from './PremiumPlanCard';
import { currentUser } from '../../../atoms';
import { useRecoilState } from 'recoil';
import WhyUpgradeToPremium from './WhyUpgradeToPremium';

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
    marginBottom: '24px',
  },
}));

const Billing = () => {
  const classes = useStyles();
  const [user] = useRecoilState(currentUser);
  const workspace = user?.activeWorkspace;

  if (!workspace) {
    return <Typography>There is no workspace at the moment.</Typography>;
  }

  return (
    <Grid container={true} className={classes.root}>
      <Typography variant="h5" className={classes.pageTitle}>
        Billing
      </Typography>
      <Grid container={true} spacing={2}>
        <Grid item={true} sm={5} xs={5}>
          {workspace.billingEnabled ? <PremiumPlanCard /> : <BasicPlanCard />}
        </Grid>

        <Grid item={true} sm={7} xs={7} className={classes.billData}>
          {workspace.billingEnabled ? (
            <>
              <BillingPeriodData />
              <PaymentHistory />
            </>
          ) : (
            <WhyUpgradeToPremium />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Billing;
