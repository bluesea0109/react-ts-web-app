import React from 'react';
import { Button } from '@bavard/react-components';
import { Box, Grid, Theme, makeStyles, Typography } from '@material-ui/core';

import OnePersonIcon from '../../../icons/OnePersonIcon';
import SettingsPanelIcon from '../../../icons/SettingsPanelIcon';
import ChatBubbleIcon from '../../../icons/ChatBubbleIcon';
import LiveConversationIcon from '../../../icons/LiveConversationIcon';
import CustomerAnalyticsIcon from '../../../icons/CustomerAnalyticsIcon';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: 'black',
    background: 'white',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    boxSizing: 'border-box',

    '& *': {
      boxSizing: 'border-box',
    },
  },
}));

interface PremiumTextProps {
  Icon: JSX.Element;
  text: string;
}

interface BasicPlanCardProps {
  onUpgradeToPremium: () => void;
}

const PremiumText: React.FC<PremiumTextProps> = ({ Icon, text }) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box mr={1}>{Icon}</Box>
      <Typography variant="subtitle1">{text}</Typography>
    </Box>
  );
};

const BasicPlanCard: React.FC<BasicPlanCardProps> = ({
  onUpgradeToPremium,
}) => {
  const classes = useStyles();

  return (
    <Grid className={classes.root}>
      <Box width={1}>Your Current Plan</Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="70%">
        <Box my={2}>
          <Typography variant="h5">Bavard Basic</Typography>
        </Box>
        <Typography>Your current subscription includes:</Typography>
        <Box py={2}>
          <PremiumText Icon={<OnePersonIcon />} text="One Virtual Assistant" />
          <PremiumText
            Icon={<SettingsPanelIcon />}
            text="Ten Assistant Action Types and Trigger Phrases"
          />
          <PremiumText Icon={<ChatBubbleIcon />} text="One Conversation Flow" />
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
      <Box
        display="flex"
        flexDirection="column"
        alignSelf="center"
        mb={1}
        width="50%">
        <Button
          title="Upgrade to Premium"
          color="primary"
          onClick={onUpgradeToPremium}
        />
      </Box>
    </Grid>
  );
};

export default BasicPlanCard;
