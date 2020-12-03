import React from 'react';
import { Button } from '@bavard/react-components';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/styles/makeStyles';

import NLPUsageIcon from '../../icons/NLPUsageIcon';
import LiveChatIcon from '../../icons/LiveChatIcon';
import ConversationFlowIcon from '../../icons/ConversationFlowIcon';
import LiveConversationIcon from '../../icons/LiveConversationIcon';
import CustomerAnalyticsIcon from '../../icons/CustomerAnalyticsIcon';

interface PremiumPlanIntroProps {
  onUpgradeNow: () => void;
  onMaybeLater: () => void;
}

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

const PremiumPlanIntro: React.FC<PremiumPlanIntroProps> = ({
  onUpgradeNow,
  onMaybeLater,
}) => {
  const classes = useMainStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      padding={2}
      paddingLeft={4}>
      <Box paddingY={2}>
        <PremiumText Icon={<NLPUsageIcon />} text="Unlimited NLP Usage" />
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

      <Box display="flex" flexDirection="column" alignSelf="center" width="80%">
        <Button
          title="Upgrade Now"
          onClick={onUpgradeNow}
          className={classes.upgradeNowButton}
        />
        <Button
          title="Maybe Later"
          onClick={onMaybeLater}
          className={classes.maybeLaterButton}
        />
      </Box>
    </Box>
  );
};

export default PremiumPlanIntro;

const useMainStyles = makeStyles(() => ({
  upgradeNowButton: {
    color: 'white',
    background: 'linear-gradient(91.71deg, #03B3FD 0.54%, #4F4FBB 86.24%)',
    margin: 5,
  },
  maybeLaterButton: {
    color: '#727272',
    background: 'rgba(0, 0, 0, 0)',
    textDecoration: 'underline',
    boxShadow: 'none',
    margin: 5,

    '&:hover': {
      background: 'rgba(0, 0, 0, 0)',
      textDecoration: 'underline',
    },
  },
}));
