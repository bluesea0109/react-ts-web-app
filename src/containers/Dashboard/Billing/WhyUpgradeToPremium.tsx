import { Box, Theme, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
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
    borderRadius: '5px',
    padding: theme.spacing(1),
    margin: `0 ${theme.spacing(-1)}px`,

    '& *': {
      boxSizing: 'border-box',
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

const WhyUpgradeToPremium = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root} width={1}>
      <Box width={1}>Your Current Plan</Box>
      <Box paddingY={2}>
        <PremiumText
          Icon={<NLPUsageIcon />}
          text="Unlimited Natural Language Processing"
        />
        <PremiumText Icon={<LiveChatIcon />} text="Live Chat capabilities" />
        <PremiumText
          Icon={<ConversationFlowIcon />}
          text="Unrestricted use of the Conversion Flow visualizer"
        />
        <PremiumText
          Icon={<LiveConversationIcon />}
          text="Live Conversation Monitoring"
        />
        <PremiumText
          Icon={<CustomerAnalyticsIcon />}
          text="Customer Analytics"
        />
      </Box>
    </Box>
  );
};

export default WhyUpgradeToPremium;
