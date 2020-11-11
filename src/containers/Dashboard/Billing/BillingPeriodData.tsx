import {
  Box,
  Button,
  Grid,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  withStyles,
} from '@material-ui/core';
import MuiTableCell from '@material-ui/core/TableCell';
import { AddCircleOutline } from '@material-ui/icons';
import React from 'react';

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
  },
})(MuiTableCell);

const useStyles = makeStyles((theme) => ({
  root: {
    color: 'black',
    height: '320px',
    marginBottom: '16px',
    backgroundColor: 'white',
    borderRadius: '5px',
  },
  header: {
    width: 'calc(100% - 40px)',
    padding: '10px 20px 10px',
    borderBottom: '2px solid lightgray',
    height: '50px',
  },
  table: {
    width: '100%',
  },
  addButton: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: '20px',
    alignSelf: 'flex-end',
  },
}));

const BillingPeriodData = () => {
  const classes = useStyles();
  const rows = [
    {
      scheduled: '10/15/2020',
      autopay: true,
      paymentMethod: 'Visa ending in 3217',
    },
  ];
  return (
    <Grid className={classes.root}>
      <Box
        p={1}
        className={classes.header}
        display="flex"
        alignContent="flex-start"
        flexDirection="row"
        alignItems="center">
        <img
          src="/card.svg"
          alt="card"
          width="25px"
          height="25px"
          style={{ marginRight: '5px' }}
        />
        <Typography>Current Billing Period</Typography>
      </Box>
      <Box display="flex" style={{ width: '100%', padding: '20px' }} flexDirection="column">
        <Table className={classes.table}>
          <TableHead>
            <TableRow style={{ fontWeight: 'bold' }}>
              <TableCell style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Scheduled Payment
              </TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '16px' }} align="left">
                AutoPay
              </TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '16px' }} align="left">
                Payment Method
              </TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '16px' }} align="left" />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="left">{row.scheduled}</TableCell>
                <TableCell align="left">{row.autopay ? 'Yes' : 'No'}</TableCell>
                <TableCell align="left">{row.paymentMethod}</TableCell>
                <TableCell align="left">
                  <Button>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Grid className={classes.addButton}>
          <Typography style={{ color: 'blue' }}> Add New Payment Method </Typography>
          <IconButton>
            <AddCircleOutline fontSize="large" style={{ color: '#5867ca' }} />
          </IconButton>
        </Grid>
      </Box>
    </Grid>
  );
};

export default BillingPeriodData;
