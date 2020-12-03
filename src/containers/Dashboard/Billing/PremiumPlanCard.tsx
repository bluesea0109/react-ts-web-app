import { Box, Theme, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: 'white',
    background:
      'linear-gradient(110.32deg, #1C1C87 14.45%, #183399 61.75%, #115FBD 95.22%)',
    borderRadius: '5px',
    padding: theme.spacing(1),
    margin: `0 ${theme.spacing(-1)}px`,

    '& *': {
      boxSizing: 'border-box',
    },
  },
}));

const BasicPlanCard = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root} width={1}>
      <Box width={1}>Your Current Plan</Box>
      <Box display="flex" flexDirection="column" alignItems="center" width={1}>
        <Box padding={2}>
          <Typography variant="h5">Bavard Premium</Typography>
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
    </Box>
  );
};

export default BasicPlanCard;
