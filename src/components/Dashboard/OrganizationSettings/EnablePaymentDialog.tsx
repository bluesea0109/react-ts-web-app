import { Button, TextField, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';

import * as EmailValidator from 'email-validator';

import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';

import {
  CardElement, Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';

import config from '../../../config';

const stripePromise = loadStripe(config.stripePublicKey);

interface IAllProps {
  orgId: string;
  billingEmail: string;
  open: any;
  onClose: any;
}

function CheckoutForm(props: IAllProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [state, setState] = useState({
    email: '',
  });

  const [doEnableBilling, enableBillingResp] = useMutation(ENABLE_BILLING);

  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };
  const validateInput = () => {
    return EmailValidator.validate(state.email);
  };

  const handlePayClick = async (event: any) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement) as StripeCardElement;
    if (!cardElement) {
      console.log('[handlePayClick] no card element');
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      console.log('[handlePayClick][error]', error);
      return;
    }

    console.log('[handlePayClick]', token);
    const stripeToken: string = token ? token.id : '';
    // enable billing
    doEnableBilling({
      variables: {
        orgId: props.orgId,
        stripeToken,
        billingEmail: props.billingEmail,
      },
    });
  };

  let dialogActions = (
    <React.Fragment>
      <DialogActions>
        <Button color="primary" onClick={props.onClose}>
          {'Cancel'}
        </Button>
        <Button
          color="secondary"
          onClick={handlePayClick}
          disabled={(!validateInput() || !stripe || !elements)}>
          {'PAY'}
        </Button>
      </DialogActions>
    </React.Fragment>
  );

  let dialogContent;
  if (enableBillingResp.error) {
    dialogContent = (
      <React.Fragment>
        <DialogContent>
          <ApolloErrorPage error={enableBillingResp.error} />
        </DialogContent>
      </React.Fragment>
    );
  } else if (enableBillingResp.loading) {
    dialogContent = (
      <React.Fragment>
        <DialogContent>
          <ContentLoading />
        </DialogContent>
      </React.Fragment>
    );
  } else if (enableBillingResp.called && enableBillingResp.data && enableBillingResp.data.BillingService_enableBilling) {
    dialogContent = (
      <React.Fragment>
        <DialogContent>
          <Typography>Your subscription has started</Typography>
        </DialogContent>
      </React.Fragment>
    );
    dialogActions = (
      <React.Fragment>
        <DialogActions>
          <Button color="primary" onClick={props.onClose}>
            {'Close'}
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  } else {
    dialogContent = (
      <React.Fragment>
        <DialogContent>
          <form noValidate={true} autoComplete="off">
            <TextField
              value={state.email}
              onChange={handleChange('email')}
              autoFocus={true}
              margin="dense"
              id="email"
              label="Billing Email"
              type="email"
              fullWidth={true}
            />
          </form>
          <br />
          <Typography>Your Card Details</Typography>
          <br />
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </DialogContent>
      </React.Fragment>
    );
  }

  return (
    <Dialog
      fullWidth={true}
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Enable Payment</DialogTitle>
      {dialogContent}
      {dialogActions}
    </Dialog>
  );
}

export default function PaymentDialog(props: IAllProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        orgId={props.orgId}
        billingEmail={props.billingEmail}
        open={props.open}
        onClose={props.onClose}
      />
    </Elements>
  );
}

const ENABLE_BILLING = gql`
  mutation($orgId: String!, $stripeToken: String!, $billingEmail: String!) {
    BillingService_enableBilling(
      orgId: $orgId
      stripeToken: $stripeToken
      billingEmail: $billingEmail
    )
  }
`;