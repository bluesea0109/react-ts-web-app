import React from 'react';
import { Button } from '@bavard/react-components';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/styles/makeStyles';

import NLPUsageIcon from './icons/NLPUsageIcon';
import LiveChatIcon from './icons/LiveChatIcon';
import ConversationFlowIcon from './icons/ConversationFlowIcon';
import LiveConversationIcon from './icons/LiveConversationIcon';
import CustomerAnalyticsIcon from './icons/CustomerAnalyticsIcon';

interface PremiumPlanIntroProps {
  onUpgradeNow: () => void;
  onMaybeLater: () => void;
}

const PremiumPlanIntro: React.FC<PremiumPlanIntroProps> = ({
  onUpgradeNow,
  onMaybeLater,
}) => {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      padding={4}>
      <Typography variant="subtitle1">
        <NLPUsageIcon />
        Unlimited NLP Usage
      </Typography>
      <Typography variant="subtitle1">
        <LiveChatIcon />
        Live Chat capabilities
      </Typography>
      <Typography variant="subtitle1">
        <ConversationFlowIcon />
        Unrestricted use of the Conversion Flow visualizer
      </Typography>
      <Typography variant="subtitle1">
        <LiveConversationIcon />
        Live Conversation Monitoring
      </Typography>
      <Typography variant="subtitle1">
        <CustomerAnalyticsIcon />
        Customer Analytics
      </Typography>

      <Box>
        <Button
          title="Upgrade Now"
          onClick={onUpgradeNow}
          className={classes.upgradeNowButton}
        />
        <Button title="Maybe Later" onClick={onMaybeLater} />
      </Box>
    </Box>
  );
};

export default PremiumPlanIntro;
const useStyles = makeStyles(() => ({
  upgradeNowButton: {
    background: 'linear-gradient(91.71deg, #03B3FD 0.54%, #4F4FBB 86.24%)',
    color: 'white',
  },
  maybeLaterbutton: {
    background: 'rgba(0, 0, 0, 0)',
    textDecoration: 'underline',
  },
}));
