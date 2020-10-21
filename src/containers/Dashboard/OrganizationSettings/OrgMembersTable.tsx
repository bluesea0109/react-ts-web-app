import { useMutation } from '@apollo/client';
import {
  Box,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,

} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';

import { IMember, IUser } from '../../../models/user-service';
import ContentLoading from '../../ContentLoading';
import IconButtonDelete from '../../IconButtons/IconButtonDelete';
import IconButtonEdit from '../../IconButtons/IconButtonEdit';
import ConfirmDialog from '../../Utils/ConfirmDialog';
import ChangeRoleDialog from './changeRoleDialog';
import { REMOVE_ORG_MEMBER } from './gql';

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

interface IOrgMembersTableProps {
  user: IUser;
  members: IMember[];
  refetchOrgs: () => void;
}
export default function OrgMembersTable(props: IOrgMembersTableProps) {
  const classes = useStyles();
  const [state, setState] = useState({
    loading: false,
    page: 0,
    rowsPerPage: 20,
    offset: 0,
  });
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [selectedMember, setSelectedMember] = useState({
    orgId: '',
    uid: '',
    role: '',
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [changeConfirm, setChangeConfirm] = useState(false);
  const [
    removeOrgMember,
    { loading, data: removedMember },
  ] = useMutation(REMOVE_ORG_MEMBER, {
    onCompleted() {
      props.refetchOrgs();
      setOpenSnackBar(true);
    },
  });

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => {
    setState({ ...state, page });
  };

  const getPage = (members: IMember[]) => {
    const { page, rowsPerPage } = state;
    return members.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const onRemoveMember = () => {
    removeOrgMember({
      variables: {
        orgId: selectedMember.orgId,
        userId: selectedMember.uid,
      },
    });
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  const role =
    props.user.activeOrg?.currentUserMember?.role || null;
  const pageItems = getPage(props.members);

  const onUpdateCallback = () => {
    props.refetchOrgs();
    setChangeConfirm(false);
  };

  const getTableRow = (member: IMember, i: number) => {
    if (member.uid === props.user.uid) {
      return (
        <TableRow key={i}>
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
                disabled={member.uid === props.user.uid || role !== 'owner'}
              />
            </Box>
          </TableCell>
          <TableCell align="left">
            <IconButtonDelete
              tooltip="Remove User"
              onClick={() => null}
              disabled={member.uid === props.user.uid || role !== 'owner'}
            />
          </TableCell>
        </TableRow>
      );
    }
    return (
      <TableRow key={i}>
        <TableCell align="left">{member.user?.name || 'unknown'}</TableCell>
        <TableCell align="left">{member.user?.email || 'unknown'}</TableCell>
        <TableCell align="left">{member.role}
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
            title="Are you sure?"
            open={confirmOpen}
            setOpen={setConfirmOpen}
            onConfirm={() => onRemoveMember()}>
            Are you sure you want to delete this member?
          </ConfirmDialog>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <React.Fragment>
      {loading ? (
        <ContentLoading />
      ) : (
          <TableContainer className={classes.tableContainer}>
            <Table aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Role</TableCell>
                  <TableCell align="left">Options</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pageItems.map((member, i) => {
                  return getTableRow(member, i);
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5]}
                    colSpan={3}
                    count={props.members?.length || 0}
                    rowsPerPage={state.rowsPerPage}
                    page={state.page}
                    SelectProps={{
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}>
        {removedMember && removedMember.removeOrgMember ? (
          <Alert onClose={handleCloseSnackBar} severity="success">
            {'A Member is removed successfully!'}
          </Alert>
        ) : (
            <Alert onClose={handleCloseSnackBar} severity="error">
              {'Sorry, we couldn\'t remove the member.'}
            </Alert>
          )}
      </Snackbar>
    </React.Fragment>
  );
}