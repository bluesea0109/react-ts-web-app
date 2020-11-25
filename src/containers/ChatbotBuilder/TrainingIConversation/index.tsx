import { useMutation, useQuery } from '@apollo/client';
import {
  IConversation,
  IDialogueTurn,
} from '@bavard/agent-config/dist/conversations';
import {
  Button,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  Box,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
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
  const [conversations, setConversations] = useState<ITrainingConversation[]>(
    [],
  );
  const agentId = parseInt(params.agentId, 10);

  const [deleteConversations, { loading }] = useMutation(
    DELETE_TRAINING_CONVERSATION,
  );
  const [
    createTrainingConversation,
    {
      loading: createTrainingConversationLoading,
      error: createTrainingConversationError,
    },
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
  const getTrainingConversations = useQuery<IGetTrainingConversation>(
    GET_TRAINING_CONVERSATIONS,
    { variables: { agentId } },
  );

  useEffect(() => {
    setConversations(
      getTrainingConversations.data?.ChatbotService_trainingConversations || [],
    );
  }, [getTrainingConversations]);

  if (getTrainingConversations.error) {
    return <ApolloErrorPage error={getTrainingConversations.error} />;
  }

  if (getTrainingConversations.loading) {
    return <ContentLoading shrinked={true} />;
  }

  const onCreateNewConversation = () => {
    createTrainingConversation({
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

        {loading && <LinearProgress />}
        {conversations.length > 0 ? (
          <ConversationList
            conversations={conversations ?? []}
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
