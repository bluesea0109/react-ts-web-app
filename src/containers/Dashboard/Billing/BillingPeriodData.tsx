import {
  Box,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';
import React from 'react';
import { CommonTable } from '../../../components';

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
  const columns = [
    {
      title: 'Scheduled Payment',
      field: 'scheduled',
    },
    {
      title: 'Autopay',
      field: 'autopay',
    },
    {
      title: 'Payment Method',
      field: 'paymentMethod',
    },
  ];
  const rows = [
    {
      scheduled: '10/15/2020',
      autopay: 'yes',
      paymentMethod: 'Visa ending in 3217',
    },
  ];
  return (
    <Grid className={classes.root}>
      <Box display="flex" style={{ width: '100%' }} flexDirection="column">
        <CommonTable
          data={{
            columns,
            rowsData: rows,
          }}
          components={{
            Toolbar: () => (
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
            ),
          }}
        />
        <Grid className={classes.addButton}>
          <Typography style={{ color: 'blue' }}>
            {' '}
            Add New Payment Method{' '}
          </Typography>
          <IconButton>
            <AddCircleOutline fontSize="large" style={{ color: '#5867ca' }} />
          </IconButton>
        </Grid>
      </Box>
    </Grid>
  );
};

export default BillingPeriodData;
