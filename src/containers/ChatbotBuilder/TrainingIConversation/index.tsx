import { useMutation, useQuery } from '@apollo/client';
import {
  IConversation,
  IDialogueTurn,
} from '@bavard/agent-config/dist/conversations';
import { Button, Grid, Paper, Typography, Box } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { ITrainingConversation } from '../../../models/chatbot-service';
import {
  CREATE_TRAINING_CONVERSATION,
  DELETE_TRAINING_CONVERSATION,
  GET_TRAINING_CONVERSATIONS,
} from '../../../common-gql-queries';

import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import ConversationList from './ConversationList';

interface IGetTrainingConversation {
  ChatbotService_trainingConversations: ITrainingConversation[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(6),
      width: '100%',
    },
    paper: {
      padding: '20px',
    },
    cetnerPagination: {
      display: 'flex',
      justifyContent: 'center',
    },
    pageTitle: {
      fontSize: '26px',
      marginBottom: '24px',
    },
  }),
);

export default function TrainingIConversations() {
  const classes = useStyles();

  const params = useParams<{ agentId: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const agentId = parseInt(params.agentId, 10);

  const [
    deleteConversations,
    { loading: deleteConversationLoading, error: deleteConversationError },
  ] = useMutation(DELETE_TRAINING_CONVERSATION);
  const [
    createConversation,
    { loading: createConversationLoading, error: createConversationError },
  ] = useMutation(CREATE_TRAINING_CONVERSATION, {
    refetchQueries: [
      {
        query: GET_TRAINING_CONVERSATIONS,
        variables: { agentId: Number(agentId) },
      },
    ],
    awaitRefetchQueries: true,
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  const {
    data: getTrainingConversationsData,
    loading: getConversationsLoading,
    error: getConversationsError,
  } = useQuery<IGetTrainingConversation>(GET_TRAINING_CONVERSATIONS, {
    variables: { agentId },
  });

  const sortedConversations = useMemo(() => {
    return [
      ...(getTrainingConversationsData?.ChatbotService_trainingConversations ||
        []),
    ].sort((a, b) => b.id - a.id);
  }, [getTrainingConversationsData]);

  const error =
    createConversationError || deleteConversationError || getConversationsError;

  const loading =
    createConversationLoading ||
    deleteConversationLoading ||
    getConversationsLoading;

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  if (loading) {
    return <ContentLoading shrinked={true} />;
  }

  const onCreateNewConversation = () => {
    createConversation({
      variables: {
        agentId: Number(agentId),
        conversation: {
          id: null,
          turns: [] as IDialogueTurn[],
          currentAgentType: 'BOT',
        } as IConversation,
      },
    });
  };

  const handleSaveConversation = () => {};

  const handleDeleteConversation = () => {};

  return (
    <Grid className={classes.root}>
      <Grid className={classes.pageTitle}>Training Conversations</Grid>
      <Paper className={classes.paper}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={onCreateNewConversation}>
            Create New Conversation
          </Button>
        </Box>

        {sortedConversations.length > 0 ? (
          <ConversationList
            conversations={sortedConversations ?? []}
            onDelete={handleDeleteConversation}
            onSave={handleSaveConversation}
          />
        ) : (
          <Typography align="center" variant="h6">
            {'No Conversation found'}
          </Typography>
        )}
      </Paper>
    </Grid>
  );
}
