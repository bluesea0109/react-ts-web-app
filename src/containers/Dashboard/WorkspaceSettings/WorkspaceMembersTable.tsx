import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CommonTable, ConfirmDialog } from '@bavard/react-components';
import {
  Box,
  Snackbar,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import _ from 'lodash';

import { IMember, IUser, IWorkspace } from '../../../models/user-service';
import ContentLoading from '../../ContentLoading';
import IconButtonDelete from '../../IconButtons/IconButtonDelete';
import IconButtonEdit from '../../IconButtons/IconButtonEdit';
import ChangeRoleDialog from './changeRoleDialog';
import { REMOVE_WORKSPACE_MEMBER } from './gql';
import ApolloErrorPage from '../../ApolloErrorPage';

interface IAlertProps {
  severity: 'error' | 'success';
  onClose: any;
  children: any;
}
const Alert = (props: IAlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: theme.spacing(1),
    },
    grow: {
      flexGrow: 1,
    },
    tableContainer: {
      maxHeight: '75vh',
    },
    iconWrapper: {
      display: 'flex',
      alignItems: 'center',
    },
  }),
);

interface IWorkspaceMembersTableProps {
  user: IUser;
  workspace: IWorkspace;
  refetchWorkspaces: () => void;
}
const WorkspaceMembersTable: React.FC<IWorkspaceMembersTableProps> = ({
  user,
  workspace,
  refetchWorkspaces,
}) => {
  const classes = useStyles();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [selectedMember, setSelectedMember] = useState({
    workspaceId: '',
    uid: '',
    role: '',
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [changeConfirm, setChangeConfirm] = useState(false);
  const [
    removeWorkspaceMember,
    { loading, data: removedMember, error: removeMemberError },
  ] = useMutation(REMOVE_WORKSPACE_MEMBER, {
    onCompleted() {
      refetchWorkspaces();
      setOpenSnackBar(true);
    },
  });
  const members = workspace.members || [];

  const onRemoveMember = () => {
    removeWorkspaceMember({
      variables: {
        workspaceId: selectedMember.workspaceId,
        userId: selectedMember.uid,
      },
    });
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  const role = user.activeWorkspace?.currentUserMember?.role || null;

  const onUpdateCallback = () => {
    refetchWorkspaces();
    setChangeConfirm(false);
  };

  if (removeMemberError) {
    return <ApolloErrorPage error={removeMemberError} />;
  }

  const MemberRow = ({ rowData: member }: { rowData: IMember }) => {
    if (member.uid === user.uid) {
      return (
        <TableRow>
          <TableCell align="left">
            <Box fontWeight="fontWeightBold">
              {member.user?.name || 'unknown'}
            </Box>
          </TableCell>
          <TableCell align="left">
            <Box fontWeight="fontWeightBold">
              {member.user?.email || 'unknown'}
            </Box>
          </TableCell>
          <TableCell align="left">
            <Box className={classes.iconWrapper}>
              <Box fontWeight="fontWeightBold">{member.role}</Box>
              <IconButtonEdit
                tooltip="Change Role"
                onClick={() => null}
                disabled={member.uid === user.uid || role !== 'owner'}
              />
            </Box>
          </TableCell>
          <TableCell align="left">
            <IconButtonDelete
              tooltip="Remove User"
              onClick={() => null}
              disabled={member.uid === user.uid || role !== 'owner'}
            />
          </TableCell>
        </TableRow>
      );
    }
    return (
      <TableRow>
        <TableCell align="left">{member.user?.name || 'unknown'}</TableCell>
        <TableCell align="left">{member.user?.email || 'unknown'}</TableCell>
        <TableCell align="left">
          {member.role}
          <IconButtonEdit
            tooltip="Change Role"
            onClick={() => {
              setChangeConfirm(true);
              setSelectedMember(member);
            }}
            disabled={role !== 'owner'}
          />
          <ChangeRoleDialog
            open={changeConfirm}
            setOpen={setChangeConfirm}
            member={selectedMember}
            onUpdateCallback={onUpdateCallback}
          />
        </TableCell>
        <TableCell align="left">
          <IconButtonDelete
            tooltip="Remove User"
            onClick={() => {
              setConfirmOpen(true);
              setSelectedMember(member);
            }}
            disabled={role !== 'owner'}
          />
          <ConfirmDialog
            isOpen={confirmOpen}
            title="Are you sure?"
            onReject={() => {
              setConfirmOpen(false);
            }}
            onConfirm={() => {
              setConfirmOpen(true);
              onRemoveMember();
            }}>
            Are you sure you want to delete this member?
          </ConfirmDialog>
        </TableCell>
      </TableRow>
    );
  };

  const columns = [
    { title: 'Name', field: 'name' },
    { title: 'Email', field: 'email' },
    { title: 'Role', field: 'role' },
    { title: 'Options', field: 'option' },
  ];

  return (
    <React.Fragment>
      {loading ? (
        <ContentLoading shrinked={true} />
      ) : (
        <TableContainer className={classes.tableContainer}>
          <CommonTable
            data={{
              columns,
              rowsData: _.cloneDeep(members),
            }}
            pagination={{
              colSpan: 3,
              rowsPerPage: 5,
            }}
            components={{
              TableRow: MemberRow,
            }}
          />
        </TableContainer>
      )}
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}>
        {removedMember && removedMember.removeWorkspaceMember ? (
          <Alert onClose={handleCloseSnackBar} severity="success">
            {'A Member is removed successfully!'}
          </Alert>
        ) : (
          <Alert onClose={handleCloseSnackBar} severity="error">
            {"Sorry, we couldn't remove the member."}
          </Alert>
        )}
      </Snackbar>
    </React.Fragment>
  );
};

export default WorkspaceMembersTable;
