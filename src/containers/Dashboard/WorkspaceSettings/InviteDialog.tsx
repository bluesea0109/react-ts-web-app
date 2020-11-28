import { useMutation } from '@apollo/client';
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
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { IUser } from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import { GET_INVITED_WORKSPACE_MEMBERS, INVITE_WORKSPACE_MEMBER } from './gql';

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
  open?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function InviteDialog(props: IProps) {
  const classes = useStyles();
  const [state, setState] = useState({
    modalOpen: props.open || false,
    role: 'editor',
    email: '',
  });
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const [inviteWorkspaceMember, inviteWorkspaceMemberResp] = useMutation(
    INVITE_WORKSPACE_MEMBER,
    {
      variables: {
        workspaceId,
        recipientEmail: state.email,
        role: state.role,
      },
      refetchQueries: [
        {
          query: GET_INVITED_WORKSPACE_MEMBERS,
          variables: { workspaceId },
        },
      ],
      awaitRefetchQueries: true,
    },
  );

  const validateInput = () => {
    return EmailValidator.validate(state.email);
  };

  const handleOpen = () => {
    setState({ ...state, modalOpen: true });
  };

  const handleClose = () => {
    setState({ ...state, modalOpen: false });
    props.onClose?.();
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
    inviteWorkspaceMember({
      variables: {
        workspaceId,
        recipientEmail: state.email,
        role: state.role,
      },
    });
    state.modalOpen = false;
    props.onSuccess?.();
  };

  let dialogContent;
  const role = props.user.activeWorkspace?.currentUserMember?.role || null;
  if (!role) {
    dialogContent = (
      <DialogContent>
        <Typography>{'Error: User member type unknown.'}</Typography>
      </DialogContent>
    );
  } else if (inviteWorkspaceMemberResp.error) {
    dialogContent = (
      <React.Fragment>
        <DialogContent>
          <ApolloErrorPage error={inviteWorkspaceMemberResp.error} />
        </DialogContent>
      </React.Fragment>
    );
  } else if (inviteWorkspaceMemberResp.loading) {
    dialogContent = (
      <React.Fragment>
        <DialogContent>
          <ContentLoading />
        </DialogContent>
      </React.Fragment>
    );
  } else if (state.modalOpen) {
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
            <FormLabel>Permissions</FormLabel>
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

  return (
    <div className={classes.root} color="inherit">
      <Dialog
        fullWidth={true}
        open={state.modalOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Invite Workspace Member
        </DialogTitle>
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