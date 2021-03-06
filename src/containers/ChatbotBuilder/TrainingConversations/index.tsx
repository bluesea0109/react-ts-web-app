import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@bavard/react-components';
import { Grid, LinearProgress, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  DELETE_TRAINING_CONVERSATION,
  GET_TRAINING_CONVERSATIONS,
} from '../../../common-gql-queries';
import { IConversation } from '@bavard/agent-config/dist/conversations';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import { ConversationBoard } from './ConversationBoard';
import CreateConversation from './NewTrainingConversations';
import BavardPagination from './Pagination';

interface IGetTrainingConversation {
  ChatbotService_trainingConversations: IConversation[];
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
    button: {
      margin: '0px 50px 20px',
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

export default function TrainingConversations() {
  const docsInPage = 5;
  const classes = useStyles();

  const params = useParams<{ agentId: string }>();
  const [createConversation, setCreateConversation] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [, seteditConversation] = useState(0); // editConversation
  const [currentPage, setCurrentPage] = useState(1);
  const agentId = parseInt(params.agentId, 10);

  const [deleteConversations, deleteConversationsResult] = useMutation(
    DELETE_TRAINING_CONVERSATION,
  );
  const getTrainingConversations = useQuery<IGetTrainingConversation>(
    GET_TRAINING_CONVERSATIONS,
    { variables: { agentId } },
  );
  let conversations =
    getTrainingConversations.data?.ChatbotService_trainingConversations || [];

  const refetchConversations = getTrainingConversations.refetch;
  const data = conversations.map((item: any) => {
    return { actions: item.conversation.turns, id: item.id };
  });

  const totalPages = Math.ceil(data.length / docsInPage);
  const records = data.slice(
    (currentPage - 1) * docsInPage,
    currentPage * docsInPage,
  );

  const commonError =
    getTrainingConversations.error || deleteConversationsResult.error;
  if (commonError) {
    return <ApolloErrorPage error={commonError} />;
  }

  if (getTrainingConversations.loading || deleteConversationsResult.loading) {
    return <ContentLoading shrinked={true} />;
  }

  const onCreateNewConversation = () => {
    setCreateConversation(true);
  };

  const onSaveCallBack = async () => {
    const refetchData = await refetchConversations();
    conversations =
      refetchData.data?.ChatbotService_trainingConversations || [];
    setCreateConversation(false);
    seteditConversation(0);
  };

  const onEditConversation = (index: number) => {
    seteditConversation(index);
  };

  const deleteConversationHandler = async (conversationId: number) => {
    const response = await deleteConversations({
      variables: {
        conversationId,
      },
    });
    if (response) {
      onSaveCallBack();
    }
  };

  const handleClose = () => {
    setCreateConversation(false);
  };

  const handlePageChange = (value: number) => {
    setCurrentPage(value); // set the page
  };

  const deleteConfirm = () => setConfirmOpen(true);

  return (
    <Grid className={classes.root}>
      <Grid className={classes.pageTitle}>Training Conversations</Grid>
      <Paper className={classes.paper}>
        <Button
          title="Create New Conversation"
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={onCreateNewConversation}
        />
        {deleteConversationsResult.loading && <LinearProgress />}
        {records.length > 0 && records ? (
          records
            .sort((a: any, b: any) => parseInt(a.id) + parseInt(b.id))
            .map((item, index) => {
              return (
                <ConversationBoard
                  key={index}
                  isUpdate={true}
                  currentPage={currentPage}
                  docsInPage={docsInPage}
                  index={index}
                  conversation={item}
                  conversationLastindex={
                    (currentPage - 1) * docsInPage + index + 1
                  }
                  onSaveCallback={onSaveCallBack}
                  confirmOpen={confirmOpen}
                  onEditConversation={onEditConversation}
                  deleteConfirm={deleteConfirm}
                  setConfirmOpen={setConfirmOpen}
                  deleteConversationHandler={deleteConversationHandler}
                />
              );
            })
        ) : (
          <Typography align="center" variant="h6">
            {'No Conversation found'}
          </Typography>
        )}
        <Grid className={classes.cetnerPagination}>
          <BavardPagination total={totalPages} onChange={handlePageChange} />
        </Grid>
      </Paper>
      {createConversation && (
        <CreateConversation
          onSaveCallback={onSaveCallBack}
          conversationLastindex={conversations.length + 1}
          onCloseCallback={handleClose}
        />
      )}
    </Grid>
  );
}
