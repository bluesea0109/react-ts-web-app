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
import { useMutation } from 'react-apollo';
import { useParams } from 'react-router';
import { IUser } from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';

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

export default function InviteDialog(props: IProps) {
  const classes = useStyles();
  const [state, setState] = useState({
    open: false,
    memberType: 'editor',
    email: '',
  });
  const { orgId } = useParams();

  const [inviteOrgMember, { error, loading }] = useMutation(INVITE_ORG_MEMBER);

  const validateInput = () => {
    return EmailValidator.validate(state.email);
  };

  const handleOpen = () => {
    setState({ ...state, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
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
        memberType: state.memberType,
      },
    });
  };

  let dialogContent;
  const memberType =
    props.user.activeOrg?.currentUserMember?.memberType || null;
  if (!memberType) {
    dialogContent = (
      <DialogContent>
        <Typography>{'Error: User member type unknown.'}</Typography>
      </DialogContent>
    );
  } else if (error) {
    dialogContent = (
      <React.Fragment>
        <DialogContent>
          <ApolloErrorPage error={error} />
        </DialogContent>
      </React.Fragment>
    );
  } else if (loading) {
    dialogContent = (
      <React.Fragment>
        <DialogContent>
          <ContentLoading />
        </DialogContent>
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
              label="Email"
              type="email"
              fullWidth={true}
            />
          </form>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Permissions</FormLabel>
            <RadioGroup
              name="memberType"
              value={state.memberType}
              onChange={handleChange('memberType')}
              row={true}>
              {memberType === 'owner' ? (
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

  return (
    <div className={classes.root} color="inherit">
      <Dialog
        fullWidth={true}
        open={state.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Invite Project Member</DialogTitle>
        {dialogContent}
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
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
      <Button size="small" onClick={handleOpen}>
        {'Invite Member'}
      </Button>
    </div>
  );
}

const INVITE_ORG_MEMBER = gql`
  mutation($orgId: String!, $recipientEmail: String!, $memberType: String!) {
    inviteOrgMember(
      orgId: $orgId
      recipientEmail: $recipientEmail
      memberType: $memberType
    ) {
      id
    }
  }
`;
