import { useMutation, useQuery } from '@apollo/client';
import { Button, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as EmailValidator from 'email-validator';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { IUser } from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';

import DisablePaymentDialog from './DisablePaymentDialog';
import EnablePaymentDialog from './EnablePaymentDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      marginTop: theme.spacing(2),
    },
  }),
);

interface IProps {
  user: IUser;
}

interface IGetOrgBilling {
  billingEnabled: boolean;
}

export default function InviteDialog(props: IProps) {
  const classes = useStyles();
  const [state, setState] = useState({
    inviteModalOpen: false,
    paymentModalOpen: false,
    disablePayment: false,
    role: 'editor',
    email: '',
  });
  const { orgId } = useParams();

  const { error, loading, data } = useQuery<IGetOrgBilling>(GET_ORG_BILLING, { variables: { id: orgId } });
  const [inviteOrgMember, inviteOrgMemberResp] = useMutation(INVITE_ORG_MEMBER);

  const validateInput = () => {
    return EmailValidator.validate(state.email);
  };

  const handleOpenInvite = () => {
    setState({ ...state, inviteModalOpen: true });
  };

  const handleCloseInvite = () => {
    setState({ ...state, inviteModalOpen: false });
  };

  const handleEnablePaymentClick = () => {
    setState({ ...state, paymentModalOpen: true });
  };

  const handleDisablePaymentClick = () => {
    setState({ ...state, disablePayment: true });
  };
  const handleCloseDisablePayment = () => {
    setState({ ...state, disablePayment: false });
  };

  const handleClosePayment = () => {
    setState({ ...state, paymentModalOpen: false });
  };
  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleInvite = async () => {
    inviteOrgMember({
      variables: {
        orgId,
        recipientEmail: state.email,
        role: state.role,
      },
    });
  };

  let dialogContent;
  const role =
    props.user.activeOrg?.currentUserMember?.role || null;
  if (!role) {
    dialogContent = (
      <DialogContent>
        <Typography>{'Error: User member type unknown.'}</Typography>
      </DialogContent>
    );
  } else if (inviteOrgMemberResp.error) {
    dialogContent = (
      <React.Fragment>
        <DialogContent>
          <ApolloErrorPage error={inviteOrgMemberResp.error} />
        </DialogContent>
      </React.Fragment>
    );
  } else if (inviteOrgMemberResp.loading) {
    dialogContent = (
      <React.Fragment>
        <DialogContent>
          <ContentLoading />
        </DialogContent>
      </React.Fragment>
    );
  } else if (state.inviteModalOpen) {
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
              label="Email"
              type="email"
              fullWidth={true}
            />
          </form>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Permissions</FormLabel>
            <RadioGroup
              name="role"
              value={state.role}
              onChange={handleChange('role')}
              row={true}>
              {role === 'owner' ? (
                <FormControlLabel
                  value="owner"
                  control={<Radio />}
                  label="Owner"
                />
              ) : null}
              <FormControlLabel
                value="editor"
                control={<Radio />}
                label="Editor"
                labelPlacement="start"
              />
              <FormControlLabel
                value="reader"
                control={<Radio />}
                label="Reader"
                labelPlacement="start"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
      </React.Fragment>
    );
  }

  const renderBillingAction = () => {
    if (error) {
      return null;
    }
    if (loading) {
      return (<Button size="small">
        <ContentLoading />
      </Button>
      );
    }
    if (data && data.billingEnabled) {
      return (<Button size="small" onClick={handleDisablePaymentClick}>
        {'Disable Payment'}
      </Button>
      );
    }
    if (data && data.billingEnabled) {
      return (<Button size="small" onClick={handleEnablePaymentClick}>
        {'Enable Payment'}
      </Button>
      );
    }
    return null;
  };

  return (
    <div className={classes.root} color="inherit">
      <Dialog
        fullWidth={true}
        open={state.inviteModalOpen}
        onClose={handleCloseInvite}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Invite Project Member</DialogTitle>
        {dialogContent}
        <DialogActions>
          <Button color="primary" onClick={handleCloseInvite}>
            {'Cancel'}
          </Button>
          <Button
            color="secondary"
            onClick={handleInvite}
            disabled={!validateInput()}>
            {'Send Invite'}
          </Button>
        </DialogActions>
      </Dialog>
      <EnablePaymentDialog
        orgId={orgId}
        billingEmail={''}
        open={state.paymentModalOpen}
        onClose={handleClosePayment}
      />
      <DisablePaymentDialog
        orgId={orgId}
        open={state.disablePayment}
        onClose={handleCloseDisablePayment}
      />
      <Button size="small" onClick={handleOpenInvite}>
        {'Invite Member'}
      </Button>
      {renderBillingAction()}
    </div>
  );
}

const INVITE_ORG_MEMBER = gql`
  mutation($orgId: String!, $recipientEmail: String!, $role: String!) {
    inviteOrgMember(
      orgId: $orgId
      recipientEmail: $recipientEmail
      role: $role
    ) {
      id
    }
  }
`;

const GET_ORG_BILLING = gql`
query($id: String) {
  orgBilling(id: $id) {
    billingEnabled
  }
}
`;
