import React from 'react';
import { useParams } from 'react-router';

import { useMutation } from '@apollo/client';
import { Button, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';

import { DISABLE_BILLING } from '../../../common-gql-queries';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: theme.spacing(1),
    },
    disableBillingButton: {
      color: '#FFFFFF',
      backgroundColor: '#FF0000',

      '&:hover': {
        color: '#FFFFFF',
        backgroundColor: '#EE0000',
      },
    },
  }),
);

export default function PaymentDialog() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    modalOpen: false,
    role: 'editor',
  });
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const [doDisableBilling, disableBillingResp] = useMutation(DISABLE_BILLING);

  const handleOpen = () => {
    setState({ ...state, modalOpen: true });
  };

  const handleClose = () => {
    setState({ ...state, modalOpen: false });
  };

  const handleDisableClick = () => {
    doDisableBilling({
      variables: {
        workspaceId,
      },
    });
  };

  let dialogActions = (
    <DialogActions>
      <Button color="primary" onClick={handleClose}>
        {'NO'}
      </Button>
      <Button color="secondary" onClick={handleDisableClick} disabled={false}>
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
  } else if (
    disableBillingResp.called &&
    disableBillingResp.data &&
    disableBillingResp.data.disableBilling
  ) {
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
          <Button color="primary" onClick={handleClose}>
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
      </React.Fragment>
    );
  }
  return (
    <div className={classes.root} color="inherit">
      <Dialog
        fullWidth={true}
        open={state.modalOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Disable Payment</DialogTitle>
        {dialogContent}
        {dialogActions}
      </Dialog>
      <Button
        size="small"
        variant="contained"
        className={classes.disableBillingButton}
        onClick={handleOpen}>
        {'Disable Billing'}
      </Button>
    </div>
  );
}
