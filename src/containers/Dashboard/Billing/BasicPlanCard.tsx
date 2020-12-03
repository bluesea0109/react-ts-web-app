import { Box, Grid, Theme, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: 'black',
    background: 'white',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),

    '& *': {
      boxSizing: 'border-box',
    },
  },
}));

const BasicPlanCard = () => {
  const classes = useStyles();

  return (
    <Grid className={classes.root}>
      <Box width={1}>Your Current Plan</Box>
      <Box display="flex" flexDirection="column" alignItems="center" width={1}>
        <Box padding={2}>
          <Typography variant="h5">Bavard Basic</Typography>
          <Typography>Your current subscription includes:</Typography>
        </Box>
        <Box padding={1} textAlign="center" width={1}>
          <Typography variant="h6">
            Your subscription to Bavard Premium provides access to unlimited
            NLP, Live Chat, unlimited Conversation Flows, Live Conversation
            monitoring, and Customer Analytics.
          </Typography>
        </Box>
        <Box padding={1}>
          <Typography variant="h5">$300</Typography>
        </Box>
        <Box>
          <Typography>per Month, per Assistant</Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default BasicPlanCard;
