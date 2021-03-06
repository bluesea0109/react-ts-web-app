import React, { useState } from 'react';

import { Button } from '@bavard/react-components';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import BillingUpgradeDialog, {
  BillingPage,
} from '../../Billing/BillingUpgradeDialog';

import { loadStripe } from '@stripe/stripe-js';
import config from '../../../config';

loadStripe(config.stripePublicKey);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '2rem',
      display: 'flex',
      flexWrap: 'wrap',
      padding: theme.spacing(1),
    },
    enableBillingButton: {
      color: '#FFFFFF',
      backgroundColor: '#0000FF',

      '&:hover': {
        color: '#FFFFFF',
        backgroundColor: '#0000EE',
      },
    },
  }),
);

export default function CheckoutForm() {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={classes.root} color="inherit">
      <Button
        title="Enable Billing"
        size="small"
        variant="contained"
        className={classes.enableBillingButton}
        onClick={handleOpen}
      />
      <BillingUpgradeDialog
        page={BillingPage.BILLING_DETAILS}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </div>
  );
}
