import React from 'react';
import { CommonTable } from '@bavard/react-components';
import { Box, Grid, makeStyles, Theme, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: 'black',
    backgroundColor: 'white',
    borderRadius: theme.spacing(1),
  },
}));

const PaymentHistory = () => {
  const classes = useStyles();

  const data = [
    { date: '09/15/2020', method: 'Visa ending in 3217', amount: '$19.66' },
    { date: '09/15/2020', method: 'Visa ending in 3217', amount: '$19.66' },
    { date: '09/15/2020', method: 'Visa ending in 3217', amount: '$19.66' },
  ];

  const columns = [
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

  return (
    <Grid container={true} className={classes.root}>
      <Box style={{ width: '100%' }}>
        <CommonTable
          data={{
            columns,
            rowsData: data,
          }}
          components={{
            Toolbar: () => (
              <Box padding={2}>
                <Typography variant="h5">Payment History</Typography>
              </Box>
            ),
          }}
        />
      </Box>
    </Grid>
  );
};

export default PaymentHistory;
