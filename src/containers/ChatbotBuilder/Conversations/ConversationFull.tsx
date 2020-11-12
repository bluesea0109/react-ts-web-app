import { createStyles, Grid, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import React from 'react';

import { IUserUtteranceAction } from '@bavard/agent-config/dist/actions/user';
import { IConversation, IDialogueTurn } from '@bavard/agent-config/dist/conversations';

interface ConversationFullProps {
  conversation: IConversation;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    userMessage: {
      backgroundColor: theme.palette.primary.light,
      padding: theme.spacing(2),
      borderRight: 'solid',
      textAlign: 'right',
      color: theme.palette.primary.contrastText,
      borderRadius: 8,
    },
    agentMessage: {
      backgroundColor: theme.palette.secondary.light,
      padding: theme.spacing(2),
      textAligh: 'left',
      color: theme.palette.secondary.contrastText,
      borderRadius: 8,
    },
  }),
);

const renderTurn = (turn: IDialogueTurn, index: number, classes: any) => {
  let userContent = <div/>;
  let agentContent = <div/>;

  if (turn.actor === 'AGENT') {
    agentContent = (
      <Paper className={classes.userMessage}>
        <Typography align="left">
          Action: {turn.agentAction?.name}
        </Typography>
        <Typography align="left">
          Type: {turn.agentAction?.type}
        </Typography>
      </Paper>
    );
  } else if (turn.actor === 'USER') {
    const userAction = turn.userAction as IUserUtteranceAction;
    userContent = (
      <Paper className={classes.agentMessage}>
        <Typography align="right">
          Utterance: {(userAction as IUserUtteranceAction).utterance}
        </Typography>
        <Typography align="right">
          Intent: {(userAction as IUserUtteranceAction).intent}
        </Typography>
      </Paper>
    );
  }

  return (
    <React.Fragment key={`turn_${index}`}>
      <Grid item={true} xs={6}>
        {userContent}
      </Grid>
      <Grid item={true} xs={6}>
        {agentContent}
      </Grid>
    </React.Fragment>
  );
};

export default function ConversationFull({conversation}: ConversationFullProps) {
  const classes = useStyles();
  return (
    <Grid container={true} spacing={2} style={{width: '100%'}}>
      <Grid item={true} xs={6}>
        <Typography align="center" variant="h6">
          User
        </Typography>
      </Grid>
      <Grid item={true} xs={6}>
        <Typography align="center" variant="h6">
          Agent
        </Typography>
      </Grid>
      {
        conversation.turns.map((turn, index) => {
          return renderTurn(turn, index, classes);
        })
      }
    </Grid>
  );
}
