import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/styles/makeStyles';

import BillingDetails from './BillingDetails';
import PremiumPlanIntro from './PremiumPlanIntro';

enum BillingPage {
  PREMIMUM_PLAN_INTRO = 'PREMIMUM_PLAN_INTRO',
  BILLING_DETAILS = 'BILLING_DETAILS',
}

interface BillingUpgradeDialogProps {
  isOpen: boolean;
}

const BillingUpgradeDialog: React.FC<BillingUpgradeDialogProps> = ({
  isOpen,
}) => {
  const classes = useStyles();

  const [currentPage, setCurrentPage] = useState<BillingPage>(
    BillingPage.PREMIMUM_PLAN_INTRO,
  );

  const handleUpgradeNow = () => {};

  const handleMaybeLater = () => {};

  return (
    <Dialog open={isOpen}>
      <Box className={classes.topBorder} />
      <DialogTitle className={classes.dialogTitle}>
        Upgrade To Bavard Premium
      </DialogTitle>
      <Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="subtitle1">$300</Typography>
          <Typography variant="subtitle2">per month, per Assistant</Typography>
        </Box>
      </Box>
      <DialogContent>
        <hr />
        {currentPage === BillingPage.PREMIMUM_PLAN_INTRO && (
          <PremiumPlanIntro
            onUpgradeNow={handleUpgradeNow}
            onMaybeLater={handleMaybeLater}
          />
        )}
        {currentPage === BillingPage.BILLING_DETAILS && <BillingDetails />}
      </DialogContent>
    </Dialog>
  );
};

export default BillingUpgradeDialog;

const useStyles = makeStyles(() => ({
  billingDialog: {
    '& .MuiDialog-paperWidthSm': {
      maxWidth: 400,
    },
  },
  dialogTitle: {
    '& .MuiTypography-root': {
      fontSize: '1.5rem',
      fontWeight: 600,
      textAlign: 'center',
    },
  },
  topBorder: {
    background: 'linear-gradient(89.88deg, #00B5FF -2.57%, #504DBA 100.2%)',
    height: 12,
  },
}));
