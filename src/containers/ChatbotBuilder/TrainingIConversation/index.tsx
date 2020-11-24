import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  Box,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  DELETE_TRAINING_CONVERSATION,
  GET_TRAINING_CONVERSATIONS,
} from '../../../common-gql-queries';
// import { IConversation, ITrainingConversations } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import ConversationList, { ConversationHeader } from './ConversationList';
import ConversationPanel from './ConversationPanel';

interface IGetTrainingConversation {
  ChatbotService_trainingConversations: [];
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

const ActionRow = () => (
  <div>
    <div>Action</div>
  </div>
);

export default function TrainingIConversations() {
  const docsInPage = 5;
  const classes = useStyles();

  const params = useParams<{ agentId: string }>();
  const [isNewConversation, setIsNewConverstaion] = useState(false);
  const [newConversation, setNewConversation] = useState(undefined);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [, seteditConversation] = useState(0); // editConversation
  const [currentPage, setCurrentPage] = useState(1);
  const agentId = parseInt(params.agentId, 10);

  const [deleteConversations, { loading }] = useMutation(
    DELETE_TRAINING_CONVERSATION,
  );
  const getTrainingConversations = useQuery<IGetTrainingConversation>(
    GET_TRAINING_CONVERSATIONS,
    { variables: { agentId } },
  );
  let conversations =
    getTrainingConversations.data?.ChatbotService_trainingConversations || [];

  const refetchConversations = getTrainingConversations.refetch;

  const totalPages = Math.ceil(conversations.length / docsInPage);
  const records = conversations.slice(
    (currentPage - 1) * docsInPage,
    currentPage * docsInPage,
  );

  if (getTrainingConversations.error) {
    return <ApolloErrorPage error={getTrainingConversations.error} />;
  }

  if (getTrainingConversations.loading) {
    return <ContentLoading shrinked={true} />;
  }

  const onCreateNewConversation = () => {
    setIsNewConverstaion(true);
  };

  const onSaveCallBack = async () => {
    const refetchData = await refetchConversations();
    conversations =
      refetchData.data?.ChatbotService_trainingConversations || [];
    setIsNewConverstaion(false);
    seteditConversation(0);
  };

  const onEditConversation = (index: number) => {
    seteditConversation(index);
  };

  const deleteConfirm = () => setConfirmOpen(true);

  const handleSaveItem = () => {};
  const handleDeleteItem = () => {};

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

        {isNewConversation && (
          <>
            {/* <ConversationHeader />
            <ConversationPanel conversation={newConversation} /> */}
          </>
        )}

        {loading && <LinearProgress />}
        {records.length > 0 && records ? (
          <ConversationList
            records={records ?? []}
            handleDelete={handleDeleteItem}
            handleSave={handleSaveItem}
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
