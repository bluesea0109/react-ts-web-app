import { BaseAgentAction, IIntent } from '@bavard/agent-config';
import { Button, Paper, TableContainer, Typography } from '@material-ui/core';
import {
  createStyles,
  withStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import { Edit } from '@material-ui/icons';
import 'firebase/auth';
import _ from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
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
      backgroundColor: "white"
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
  // const columns: Column<IIntent>[] = [
  //   {
  //     title: 'Name',
  //     field: 'name',
  //     editable: 'never',
  //     cellStyle: {
  //       backgroundColor: 'white',
  //     },
  //     headerStyle: {
  //       backgroundColor: 'white',
  //     }
  //   },
  //   {
  //     title: 'Default Action',
  //     render: rowData => rowData.defaultActionName ??
  //       <Typography style={{ color: '#808080' }}>N/A</Typography>,
  //     editable: 'never',
  //   },
  // ];

  const deleteIntentHandler = (intent: IIntent) => {
    onDeleteIntent(intent);
  };

  console.log('itents :  ', intents);

  return (
    <Paper className={classes.paper}>
      <TableContainer component={Paper} aria-label="Agents">
        {/* <MaterialTable
          title={
            <h5>Intents</h5>            
          }
          columns={columns}
          data={_.cloneDeep(intents)}
          options={{
            actionsColumnIndex: -1,
            paging: true,
            pageSize: 10,
            headerStyle: {
              backgroundColor: 'white',              
            },
            rowStyle: {
              backgroundColor: 'white',              
            },
            searchFieldStyle: {
              backgroundColor: 'white'
            }
          }}
          localization={{
            body: {
              editRow: {
                deleteText: 'Are you sure delete this Intent?',
              },
            },
          }}
          actions={[
            {
              icon: () => <Edit />,
              tooltip: 'Edit Intent',
              onClick: (event, rowData) => {
                const data = rowData as IIntent;
                onEditIntent(data);
              },
            },
          ]}
          editable={{
            onRowDelete: async (intent) => deleteIntentHandler(intent),
          }}
        /> */}
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="left">Default Action</StyledTableCell>           
              <StyledTableCell align="left">Action</StyledTableCell>   
            </TableRow>
          </TableHead>
          <TableBody>
            {_.cloneDeep(intents).map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="left">{row.defaultActionName??<Typography style={{ color: '#808080' }}>N/A</Typography>}</StyledTableCell>                
                <StyledTableCell component="th" scope="row">
                  {row.name}
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
