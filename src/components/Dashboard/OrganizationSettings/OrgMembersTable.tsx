import React, { Component } from 'react';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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

const tableStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  }
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(tableStyles, { withTheme: true })(
  TablePaginationActions,
);

const styles = theme => ({
  button: {
    marginLeft: theme.spacing.unit
  },
  grow: {
    flexGrow: 1,
  },
});

class ProjectMembersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      page: 0,
      rowsPerPage: 5,
      offset: 0,
    };
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  getPage = (items) => {
    return items;
    //const { page, rowsPerPage } = this.state;
    //return items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }

  render() {
    const { classes, members } = this.props;

    const pageItems = this.getPage(members);

    return (
      <Paper>
        <Toolbar variant="dense">
          <Typography variant="h6">
            {"Project Members"}
          </Typography>
          <Typography className={classes.grow}>
          </Typography>
          {this.props.project.memberType === 'owner' ? (
            <ProjectMemberInvite projectId={this.props.project.id} memberType={this.props.project.memberType} />
          ): null}
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
                  <TableCell align="left">
                    {item.name}
                  </TableCell>
                  <TableCell align="left">
                    {item.email}
                  </TableCell>
                  <TableCell align="left">
                    {item.memberType}
                  </TableCell>
                  <TableCell align="left">
                  </TableCell>
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
}

ProjectMembersTable.propTypes = {
  classes: PropTypes.object.isRequired,
  members: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  withStyles(styles),
)(ProjectMembersTable);

