import { Button, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';

interface IAllProps {
  orgId: string;
  open: any;
  onClose: any;
}

export default function PaymentDialog(props: IAllProps) {
  const [doDisableBilling, disableBillingResp] = useMutation(DISABLE_BILLING);
  const handleDisableClick = () => {
    doDisableBilling({
      variables: {
        orgId: props.orgId,
      },
    });
  };

  let dialogActions = (
    <DialogActions>
      <Button color="primary" onClick={props.onClose}>
        {'NO'}
      </Button>
      <Button
        color="secondary"
        onClick={handleDisableClick}
        disabled={false}>
        {'YES'}
      </Button>
    </DialogActions>
  );

  let dialogContent;
  if (disableBillingResp.error) {
    dialogContent = (
      <React.Fragment>
        <DialogContent>
          <ApolloErrorPage error={disableBillingResp.error} />
        </DialogContent>
      </React.Fragment>
    );
  } else if (disableBillingResp.loading) {
    dialogContent = (
      <React.Fragment>
        <DialogContent>
          <ContentLoading />
        </DialogContent>
      </React.Fragment>
    );
  } else if (disableBillingResp.called && disableBillingResp.data && disableBillingResp.data.BillingService_enableBilling) {
    dialogContent = (
      <React.Fragment>
        <DialogContent>
          <Typography>Your subscription has been cancelled</Typography>
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
          <Typography>Cancel your subscription?</Typography>
        </DialogContent>
      </React.Fragment>);
  }
  return (
    <Dialog
      fullWidth={true}
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Disable Payment</DialogTitle>
      {dialogContent}
      {dialogActions}
    </Dialog>
  );
}

const DISABLE_BILLING = gql`
  mutation($orgId: String!) {
    BillingService_disableBilling(
      orgId: $orgId
    )
  }
`;
