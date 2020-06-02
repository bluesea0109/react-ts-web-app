import React, { Component, useState } from 'react';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import {
  withStyles,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Paper from '@material-ui/core/Paper';
import { withRouter } from 'react-router-dom';
import ProjectMemberInvite from './InviteDialog';
import { IMember } from '../../../models';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: theme.spacing(1),
    },
    grow: {
      flexGrow: 1,
    },
  })
);

interface IOrgMembersTableProps {
  orgId: string;
}

export default function OrgMembersTable(props: IOrgMembersTableProps) {
  const classes = useStyles();
  const [state, setState] = useState({
    loading: false,
    page: 0,
    rowsPerPage: 20,
    offset: 0,
  });

  const handleChangePage = (event, page) => {
    setState({ ...state, page });
  };

  const getPage = (items: IMember[]) => {
    const { page, rowsPerPage } = state;
    return items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const pageItems = getPage(members);

  return (
    <Paper>
      <Toolbar variant="dense">
        <Typography variant="h6">{'Project Members'}</Typography>
        <Typography className={classes.grow}></Typography>
        {this.props.project.memberType === 'owner' ? (
          <ProjectMemberInvite
            projectId={this.props.project.id}
            memberType={this.props.project.memberType}
          />
        ) : null}
      </Toolbar>
      <Table className={classes.table} padding="dense">
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Member Type</TableCell>
            <TableCell align="left">Options</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pageItems.map((item, i) => {
            return (
              <TableRow key={i} hover>
                <TableCell align="left">{item.name}</TableCell>
                <TableCell align="left">{item.email}</TableCell>
                <TableCell align="left">{item.memberType}</TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5]}
              colSpan={3}
              count={members.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              SelectProps={{
                native: true,
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActionsWrapped}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  );
}
