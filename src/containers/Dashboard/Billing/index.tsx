import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import { Grid, makeStyles, Typography } from '@material-ui/core';

import BillingPeriodData from './BillingPeriodData';
import PaymentHistory from './PaymentHistory';
import BasicPlanCard from './BasicPlanCard';
import PremiumPlanCard from './PremiumPlanCard';
import WhyUpgradeToPremium from './WhyUpgradeToPremium';
import BillingUpgradeDialog, {
  BillingPage,
} from '../../Billing/BillingUpgradeDialog';

import { IWorkspace } from '../../../models/user-service';
import { GET_WORKSPACES } from '../../../common-gql-queries';

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

interface IGetWorkspaces {
  workspaces: IWorkspace[];
}

const Billing = () => {
  const classes = useStyles();
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data } = useQuery<IGetWorkspaces>(GET_WORKSPACES, {
    variables: { id: workspaceId },
  });

  if (!data || !data.workspaces || !data.workspaces.length) {
    return <Typography>There is no workspace at the moment.</Typography>;
  }

  const workspace = data.workspaces[0];

  const handleUpgradeToPremium = () => {
    setShowBillingDialog(true);
  };

  const handleCloseBillingDialog = () => {
    setShowBillingDialog(false);
  };

  return (
    <Grid container={true} className={classes.root}>
      <Typography variant="h5" className={classes.pageTitle}>
        Billing
      </Typography>
      {workspace.billingEnabled ? (
        <Grid container={true} spacing={2}>
          <Grid item={true} sm={5} xs={5}>
            <PremiumPlanCard />
          </Grid>

          <Grid item={true} sm={7} xs={7} className={classes.billData}>
            <BillingPeriodData />
            <PaymentHistory />
          </Grid>
        </Grid>
      ) : (
        <Grid container={true} spacing={2}>
          <Grid item={true} sm={6}>
            <BasicPlanCard onUpgradeToPremium={handleUpgradeToPremium} />
          </Grid>
          <Grid item={true} sm={6}>
            <WhyUpgradeToPremium onUpgradeToPremium={handleUpgradeToPremium} />
          </Grid>
        </Grid>
      )}

      <BillingUpgradeDialog
        page={BillingPage.BILLING_DETAILS}
        isOpen={showBillingDialog}
        onClose={handleCloseBillingDialog}
      />
    </Grid>
  );
};

export default Billing;
