import { BaseAgentAction, IIntent } from '@bavard/agent-config';
import {
  Button,
  Grid,
  Paper,
  TableContainer,
  Typography,
  TextField,
} from '@material-ui/core';
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
import React, { useState } from 'react';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: 'wihte',
  },
  body: {
    padding: '5px',
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
      backgroundColor: 'white',
    },
    paper: {
      padding: theme.spacing(4),
      backgroundColor: 'white',
      width: '80%',
      marginLeft: '80px'
    },
    table: {
      minWidth: '600px',
      background: 'white',
      width: '100%',
      margin: 'auto',
    },
    headerName: {
      display: 'flex',
      alignItems: 'flex-start'
    },
    intro: {
      display: 'inline-block',
      width: '50%',
    },
    rightLayout: {
      display: 'flex',
      top: '0px',
      float: 'right',
    },
    title: {
      fontSize: '22px',
      marginBottom: '5px',
    },
    desc: {
      fontSize: '15px',
      marginBottom: '10px',
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
  
  const [filter, setFilter] = useState<string>('')


  const deleteIntentHandler = (intent: IIntent) => {
    onDeleteIntent(intent);
  };

  const handleEdit = (rowData: IIntent) => {
    const data = rowData as IIntent;
    onEditIntent(data);
  };
  console.log('Filter ', filter)
  console.log('itents :  ', intents);
  const filteredIntents = intents.filter((item) => item.name.toLowerCase().includes(filter.toLocaleLowerCase()))
  console.log('Result ', filteredIntents)

  return (
    <Paper className={classes.paper}>
      <div className={classes.intro}>
        <div className={classes.title}>Intents</div>
        <div className={classes.desc}>
          Edit an Intent below to add examples of user queries. Add several
          examples to ensure that your Assistant will respond accurately.
        </div>
      </div>
      <div className={classes.rightLayout}>
        <Button
          variant="contained"
          color="primary"
          onClick={onAdd}>
          Add New Intent
        </Button>
      </div>
      <Grid>
        <Typography className={classes.headerName}></Typography>
      </Grid>
      <TableContainer
        component={Paper}
        aria-label="Agents"
        className={classes.table}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>
                <div className={classes.headerName}>
                  <div style={{margin: '20px'}}>Name</div>
                  <div>
                    <TextField
                      id="standard-search"
                      label="Search field"
                      type="search"
                      onChange={e => setFilter(e.target.value)}
                    />
                  </div>
                </div>
              </StyledTableCell>
              <StyledTableCell align="left">Default Action</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.cloneDeep(filteredIntents).map((row) => (
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
