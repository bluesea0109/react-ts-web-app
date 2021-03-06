import { useMutation } from '@apollo/client';
import { Button } from '@bavard/react-components';
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

  const [changeMemberRole, { loading, error }] = useMutation(
    CHANGE_WORKSPACE_MEMBERS_ROLE,
    {
      onCompleted() {
        props.onUpdateCallback();
      },
    },
  );

  const onChangeMemberRole = () => {
    changeMemberRole({
      variables: {
        workspaceId: props.member?.workspaceId,
        userId: props.member?.uid,
        role: state.role,
      },
    });
  };

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  if (loading) {
    return <ContentLoading />;
  }

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="confirm-dialog">
      <DialogTitle id="confirm-dialog" className={classes.dialogTitle}>
        Change Member Role
      </DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button
          title="Cancel"
          variant="contained"
          onClick={() => props.setOpen(false)}
          color="default"
        />
        <Button
          title="Update"
          variant="contained"
          disabled={loading}
          onClick={() => {
            onChangeMemberRole();
          }}
          color="secondary"
        />
      </DialogActions>
    </Dialog>
  );
};

const CHANGE_WORKSPACE_MEMBERS_ROLE = gql`
  mutation(
    $workspaceId: String!
    $role: WorkspaceMemberRole!
    $userId: String!
  ) {
    changeWorkspaceMemberRole(
      workspaceId: $workspaceId
      role: $role
      userId: $userId
    ) {
      workspaceId
      uid
      role
      user {
        uid
        email
        name
        workspaces {
          id
          name
        }
      }
    }
  }
`;

export default ChangeRoleDialog;
