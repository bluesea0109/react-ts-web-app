import { useQuery } from '@apollo/react-hooks';
import { Badge, createStyles, Divider, Grid, List, ListItem, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import _ from 'lodash';
import React, { useState } from 'react';
import { useParams} from 'react-router-dom';
import { IConversation } from '../../../models/chatbot-service';
import ConversationFull from './ConversationFull';
import {getLiveConversationsQuery} from './gql';
import {GetLiveConversationsQueryResult} from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      overflow: 'auto',
      width: '100%',
    },
    paper: {
      padding: theme.spacing(2),
    },
    conversationListItem: {
      borderBottom: 'solid 1px',
      borderBottomColor: theme.palette.divider,
      padding: theme.spacing(2),
      cursor: 'pointer',
    },
    conversationsList: {
      height: '82vh',
      overflowY: 'scroll',
    },
    conversationContainer: {
      height: '82vh',
      overflowY: 'scroll',
    },
  }),
);

export default function ConversationsTab() {
  const classes = useStyles();
  let { agentId } = useParams();

  const [selectedConversationId, selectConversation] = useState(0);

  agentId = parseInt(agentId, 10);
  

  const { data } = useQuery<GetLiveConversationsQueryResult>(getLiveConversationsQuery, {
    variables: { agentId },
  });

  const conversations = data?.ChatbotService_liveConversations || [];
  const selectedConv = _.find(conversations, {id: selectedConversationId || conversations[0]?.id});

  return (
    <div className={classes.root}>
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={4}>
          <Paper className={`${classes.paper} ${classes.conversationsList}`}>
            <Typography variant="h6" align="center">Live Conversations</Typography>
            <Divider/>

            <List>
            {
              conversations.map((c: IConversation, index) => {
                return (
                  <ListItem
                    key={c.id}
                    onClick={() => selectConversation(c.id)}
                    selected={selectedConversationId === c.id}
                    className={classes.conversationListItem}
                    >
                    <Typography>
                      <span>Conversation {index = 1} </span>  &nbsp; &nbsp;
                      <Badge badgeContent={c.turns?.length || 0} color="secondary"/>
                    </Typography>
                  </ListItem>
                );
              })
            }
            </List>

          </Paper>
        </Grid>

        <Grid item={true} xs={8}>
          <Paper className={`${classes.paper} ${classes.conversationContainer}`}>
            { selectedConv ? <ConversationFull conversation={selectedConv} /> : ''}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
