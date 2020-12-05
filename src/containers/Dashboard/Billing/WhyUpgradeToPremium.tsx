import React from 'react';
import { Button } from '@bavard/react-components';
import { Box, Grid, Theme, makeStyles, Typography } from '@material-ui/core';

import NLPUsageIcon from '../../../icons/NLPUsageIcon';
import LiveChatIcon from '../../../icons/LiveChatIcon';
import ConversationFlowIcon from '../../../icons/ConversationFlowIcon';
import LiveConversationIcon from '../../../icons/LiveConversationIcon';
import CustomerAnalyticsIcon from '../../../icons/CustomerAnalyticsIcon';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: 'white',
    background:
      'linear-gradient(109.22deg, #1C1C87 14.47%, #1B228C 49.84%, #1060BD 97.26%);',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(5),
    height: '100%',
    boxSizing: 'border-box',

    '& *': {
      boxSizing: 'border-box',
    },
  },
  switchButton: {
    color: '#0021FF',
    backgroundColor: 'white',

    '&:hover': {
      color: '#0000CC',
      backgroundColor: '#EEEEEE',
    },
  },
}));

interface PremiumTextProps {
  Icon: JSX.Element;
  text: string;
}

const PremiumText: React.FC<PremiumTextProps> = ({ Icon, text }) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" paddingX={1}>
      <Box padding={1}>{Icon}</Box>
      <Typography variant="subtitle1">{text}</Typography>
    </Box>
  );
};

interface WhyUpgradeToPremiumProps {
  onUpgradeToPremium: () => void;
}

const WhyUpgradeToPremium: React.FC<WhyUpgradeToPremiumProps> = ({
  onUpgradeToPremium,
}) => {
  const classes = useStyles();

  return (
    <Grid className={classes.root}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        mt={1}
        width="70%">
        <Box textAlign="center" mb={2}>
          <Typography variant="h5">Why Upgrade to Bavard Premium?</Typography>
        </Box>
        <PremiumText
          Icon={<NLPUsageIcon color="white" />}
          text="Unlimited Natural Language Processing"
        />
        <PremiumText
          Icon={<LiveChatIcon color="white" />}
          text="Live Chat capabilities"
        />
        <PremiumText
          Icon={<ConversationFlowIcon color="white" />}
          text="Unrestricted use of the Conversion Flow visualizer"
        />
        <PremiumText
          Icon={<LiveConversationIcon color="white" />}
          text="Live Conversation Monitoring"
        />
        <PremiumText
          Icon={<CustomerAnalyticsIcon color="white" />}
          text="Customer Analytics"
        />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignSelf="center"
        mb={1}
        width="50%">
        <Button
          title="Make the Switch"
          className={classes.switchButton}
          onClick={onUpgradeToPremium}
        />
      </Box>
    </Grid>
  );
};

export default WhyUpgradeToPremium;
