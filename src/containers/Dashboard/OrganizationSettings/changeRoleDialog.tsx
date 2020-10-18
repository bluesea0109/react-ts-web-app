import { useMutation } from '@apollo/client';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';

interface IChangeRoleDialogProps {
    open: boolean;
    member: any;
    setOpen: (open: boolean) => void;
    onUpdateCallback: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContent: {
     '&:first-child': {
        paddingTop: 0,
     },
    },
    dialogTitle: {
      paddingBottom: 0,
    },
  }),
);

const ChangeRoleDialog: React.FC<IChangeRoleDialogProps> = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    role: 'editor',
   });

  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const [ changeMemberRole, { loading, error }] = useMutation(CHANGE_ORG_MEMBERS_ROLE, {
    onCompleted() {
        props.onUpdateCallback();
    },
  });

  const onChangeMemberRole = () => {
    changeMemberRole({
      variables: {
        orgId: props.member?.orgId,
        userId: props.member?.uid,
        role: state.role,
      },
    });
  };

  let dialogContent;
  if (error) {
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
        <DialogContent className={classes.dialogContent}>
          <ContentLoading />
        </DialogContent>
      </React.Fragment>
    );
  } else {
    dialogContent = (
    <React.Fragment>
      <DialogContent className={classes.dialogContent}>
        <FormControl component="fieldset">
          <RadioGroup
            name="role"
            value={state.role}
            onChange={handleChange('role')}
            row={false}>
                <FormControlLabel
                value="owner"
                control={<Radio />}
                label="Owner"
                />
                <FormControlLabel
                value="editor"
                control={<Radio />}
                label="Editor"
                />
                <FormControlLabel
                value="viewer"
                control={<Radio />}
                label="Viewer"
                />
          </RadioGroup>
        </FormControl>
      </DialogContent>
    </React.Fragment>
  ); }

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog" className={classes.dialogTitle}>Change Member Role</DialogTitle>
      <DialogContent>{dialogContent}</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => props.setOpen(false)}
          color="default"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={loading}
          onClick={() => {
            onChangeMemberRole();
          }}
          color="secondary"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CHANGE_ORG_MEMBERS_ROLE = gql`
  mutation($orgId: String!, $role: OrgMemberRole!, $userId: String!) {
    changeOrgMemberRole(orgId: $orgId, role: $role, userId: $userId) {
      orgId
      uid
      role
      user {
        uid
        email
        name
        orgs {
          id
          name
        }
      }
    }
  }
`;

export default ChangeRoleDialog;
