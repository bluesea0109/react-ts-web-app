import { CommonTable } from '@bavard/react-components';
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useMemo } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    color: 'black',
    height: '320px',
    backgroundColor: 'white',
    borderRadius: '5px',
  },
  header: {
    width: '100%',
    padding: '10px 20px 10px',
    height: '30px',
  },
}));

const PaymentHistory = () => {
  const classes = useStyles();
  const data = [
    { date: '09/15/2020', method: 'Visa ending in 3217', amount: '$19.66' },
    { date: '09/15/2020', method: 'Visa ending in 3217', amount: '$19.66' },
    { date: '09/15/2020', method: 'Visa ending in 3217', amount: '$19.66' },
  ];
  const columns = useMemo(() => {
    return [
      {
        title: 'Payment Date',
        field: 'date',
      },
      {
        title: 'Payment Method',
        field: 'method',
      },
      {
        title: 'Amount',
        field: 'amount',
      },
    ];
  }, []);
  return (
    <Grid container={true} className={classes.root}>
      <Box
        className={classes.header}
        display="flex"
        alignContent="flex-start"
        flexDirection="row"
        alignItems="center">
        <Typography>Payment History</Typography>
      </Box>
      <Box style={{ width: '100%' }}>
        <CommonTable
          data={{
            columns,
            rowsData: data,
          }}
        />
      </Box>
    </Grid>
  );
};

export default PaymentHistory;
