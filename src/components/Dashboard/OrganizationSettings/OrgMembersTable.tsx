import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { IMember, IUser } from '../../../models';
import InviteDialog from './InviteDialog';
import IconButtonDelete from '../../IconButtons/IconButtonDelete';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: theme.spacing(1),
    },
    grow: {
      flexGrow: 1,
    },
  }),
);

interface IOrgMembersTableProps {
  user: IUser;
  members: IMember[];
}

export default function OrgMembersTable(props: IOrgMembersTableProps) {
  const classes = useStyles();
  const [state, setState] = useState({
    loading: false,
    page: 0,
    rowsPerPage: 20,
    offset: 0,
  });

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setState({ ...state, page });
  };

  const getPage = (members: IMember[]) => {
    const { page, rowsPerPage } = state;
    return members.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const memberType = props.user.activeOrg?.currentUserMember?.memberType || null;
  const pageItems = getPage(props.members);

  const getTableRow = (member: IMember, i: number) => {
    if (member.uid === props.user.uid) {
      return (
        <TableRow key={i}>
          <TableCell align="left"><Box fontWeight="fontWeightBold">{member.user?.name || 'unknown'}</Box></TableCell>
          <TableCell align="left"><Box fontWeight="fontWeightBold">{member.user?.email || 'unknown'}</Box></TableCell>
          <TableCell align="left"><Box fontWeight="fontWeightBold">{member.memberType}</Box></TableCell>
          <TableCell align="left">
            <IconButtonDelete tooltip="Remove User" onClick={() => null} disabled={member.uid === props.user.uid || memberType !== 'owner'} />
          </TableCell>
        </TableRow>
      );
    }
    return (
      <TableRow key={i}>
        <TableCell align="left">{member.user?.name || 'unknown'}</TableCell>
        <TableCell align="left">{member.user?.email || 'unknown'}</TableCell>
        <TableCell align="left">{member.memberType}</TableCell>
        <TableCell align="left">
          <IconButtonDelete tooltip="Remove User" onClick={() => null} disabled={memberType !== 'owner'} />
        </TableCell>
      </TableRow>
    );
  }
  return (
    <Paper>
      <Toolbar variant="dense">
        <Typography variant="h6">{'Org Members'}</Typography>
        <Typography className={classes.grow}/>
        {memberType === 'owner' ? (
          <InviteDialog user={props.user} />
        ) : null}
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Member Type</TableCell>
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
    </Paper>
  );
}
