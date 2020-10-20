import { BaseAgentAction, IIntent } from '@bavard/agent-config';
import { Button, Paper, TableContainer, Typography } from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Edit, Delete } from '@material-ui/icons';
import 'firebase/auth';
import _ from 'lodash';
import React from 'react';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#f4f4f4',    
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(4),
      backgroundColor: 'white',
    },
    table: {
      minWidth: '700px',
    },
  })
);

interface IntentsTableProps {
  onEditIntent: (intent: IIntent) => void;
  onDeleteIntent: (intent: IIntent) => void;
  intents: IIntent[];
  actions: BaseAgentAction[];
  onAdd: () => void;
}

function IntentsTable({
  intents,
  actions,
  onAdd,
  onEditIntent,
  onDeleteIntent,
}: IntentsTableProps) {
  const classes = useStyles();

  const deleteIntentHandler = (intent: IIntent) => {
    onDeleteIntent(intent);
  };

  const handleEdit = (rowData: IIntent) => {
    const data = rowData as IIntent;
    onEditIntent(data);
  };
  console.log('itents :  ', intents);

  return (
    <Paper className={classes.paper}>
      <TableContainer component={Paper} aria-label="Agents">
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="left">Default Action</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.cloneDeep(intents).map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {row.defaultActionName ?? (
                    <Typography style={{ color: '#808080' }}>N/A</Typography>
                  )}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="right">
                  <Button onClick={() => handleEdit(row)}>
                    <Edit />
                  </Button>
                  <Button onClick={() => deleteIntentHandler(row)}>
                    <Delete />
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>    
  );
}

export default IntentsTable;
