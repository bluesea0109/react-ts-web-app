import { useQuery } from '@apollo/client';
import { IConversation } from '@bavard/agent-config/dist/conversations';
import {
  Badge,
  createStyles,
  Divider,
  Grid,
  List,
  ListItem,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import _ from 'lodash';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentLoading from '../../ContentLoading';
import ConversationFull from './ConversationFull';
import { getLiveConversationsQuery } from './gql';
import { GetLiveConversationsQueryResult } from './types';

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
  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);

  const [selectedConversationId, selectConversation] = useState(0);

  const queryResult = useQuery<GetLiveConversationsQueryResult>(
    getLiveConversationsQuery,
    {
      fetchPolicy: 'no-cache',
      variables: { agentId },
    },
  );

  const { data, loading } = queryResult;
  const conversations = data?.ChatbotService_liveConversations || [];
  const selectedConv = _.find(conversations, {
    id: selectedConversationId || conversations[0]?.id,
  });

  return (
    <div className={classes.root}>
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={4}>
          <Paper className={`${classes.paper} ${classes.conversationsList}`}>
            <Typography variant="h6" align="center">
              Live Conversations
            </Typography>
            <Divider />
            {loading ? (
              <ContentLoading shrinked={true} />
            ) : (
              <List>
                {conversations.map((c: IConversation, index: number) => {
                  return (
                    <ListItem
                      key={c.id}
                      onClick={() => selectConversation(c.id || 1)}
                      selected={
                        selectedConversationId === c.id ||
                        (!selectedConversationId && index === 0)
                      }
                      className={classes.conversationListItem}>
                      <Typography>
                        <span>Conversation {index + 1} </span> &nbsp; &nbsp;
                        <Badge
                          badgeContent={c.turns?.length || 0}
                          color="secondary"
                        />
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item={true} xs={8}>
          <Paper
            className={`${classes.paper} ${classes.conversationContainer}`}>
            {selectedConv ? (
              <ConversationFull conversation={selectedConv} />
            ) : (
              ''
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
