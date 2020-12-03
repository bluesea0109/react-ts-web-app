import React from 'react';
import { Button, CommonTable } from '@bavard/react-components';
import { Box, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';
import BillingBagIcon from '../../../icons/BillingBagIcon';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: 'black',
    backgroundColor: 'white',
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  toolBar: {
    borderBottom: '2px solid gray',
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
          editable={{
            isEditable: true,
            onRowEdit: () => {},
          }}
          components={{
            Toolbar: () => (
              <Box
                p={1}
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                className={classes.toolBar}>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  px={1}>
                  <Box px={1}>
                    <BillingBagIcon />
                  </Box>
                  <Typography>
                    Current Billing Period (9/16/20 - 10/15/2020)
                  </Typography>
                </Box>
                <Button
                  title="Add New Payment Method"
                  color="primary"
                  variant="text"
                  RightIcon={AddCircleOutline}
                  onClick={() => {}}
                />
              </Box>
            ),
          }}
        />
      </Box>
    </Grid>
  );
};

export default BillingPeriodData;
