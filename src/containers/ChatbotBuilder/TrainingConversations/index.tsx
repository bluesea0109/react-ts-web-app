import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  DELETE_TRAINING_CONVERSATION,
  GET_TRAINING_CONVERSATIONS,
} from '../../../common-gql-queries';
import { ITrainingConversations } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import { ConversationBoard } from './ConversationBoard';
import CreateConversation from './NewTrainingConversations';
import BavardPagination from './Pagination';

interface IGetTrainingConversation {
  ChatbotService_trainingConversations: ITrainingConversations[];
}

export default function TrainingConversations() {
  const docsInPage = 5;
  const classes = useStyles();

  const { agentId } = useParams<{ agentId: string }>();
  const [createConversation, setcreateConversation] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [, seteditConversation] = useState(0);  // editConversation
  const [currentPage, setCurrentPage] = useState(1);
  const numAgentId = Number(agentId);

  const [deleteConversations, { loading }] = useMutation(
    DELETE_TRAINING_CONVERSATION,
  );
  const getTrainingConversations = useQuery<IGetTrainingConversation>(
    GET_TRAINING_CONVERSATIONS,
    { variables: { agentId: numAgentId } },
  );
  let conversations =
    getTrainingConversations.data?.ChatbotService_trainingConversations || [];

  const refetchConversations = getTrainingConversations.refetch;
  const data = conversations.map((item: any) => {
    const userActions = item.userActions.map((a: any) => ({
      ...a,
      isUser: true,
    }));
    const agentActions = item.agentActions.map((a: any) => ({
      ...a,
      isAgent: true,
    }));
    const arr = userActions
      .concat(agentActions)
      .sort((a: any, b: any) => parseFloat(a.turn) - parseFloat(b.turn));
    return { actions: arr, id: item.id };
  });

  const totalPages = Math.ceil(data.length / docsInPage);
  const records = data.slice(
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
    setcreateConversation(true);
  };

  const onSaveCallBack = async () => {
    const refetchData = await refetchConversations();
    conversations =
      refetchData.data?.ChatbotService_trainingConversations || [];
    setcreateConversation(false);
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
    setcreateConversation(false);
  };

  const handlePageChange = (value: number) => {
    setCurrentPage(value); // set the page
  };

  const deleteConfirm = () => setConfirmOpen(true);

  return (
    <>
      <Paper className={classes.paper}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={onCreateNewConversation}>
          Create New Conversation
        </Button>
        {loading && <LinearProgress />}
        <>
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
        </>
      </Paper>
      {createConversation && (
        <CreateConversation
          onSaveCallback={onSaveCallBack}
          conversationLastindex={conversations.length + 1}
          onCloseCallback={handleClose}
        />
      )}
    </>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '90%',
      marginLeft: '5%',
      marginRight: '5%',
      padding: '20px',
    },
    button: {
      margin: '0px 50px 20px',
    },
    cetnerPagination: {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);
