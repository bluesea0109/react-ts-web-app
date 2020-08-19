import { useMutation, useQuery } from '@apollo/client';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CHATBOT_GET_TAGS } from '../../../common-gql-queries';
import { IIntent } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { getActionsQuery } from '../Actions/gql';
import { GetActionsQueryResult } from '../Actions/types';
import { TagsQueryResult } from '../Examples/types';
import AddIntent from './AddIntent';
import EditIntent from './EditIntent';
import { deleteIntentMutation, getIntentsQuery, updateIntentMutation } from './gql';
import IntentsTable from './IntentsTable';
import { GetIntentsQueryResult } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      overflow: 'auto',
    },
    paper: {
      padding: theme.spacing(2),
    },
  }),
);

const IntentSection: React.FC = () => {
  const classes = useStyles();
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const [currentIntent, setCurrentIntent] = useState<Maybe<number>>();
  const [newIntent, setNewIntent] = useState(false);

  const { data, loading, error } = useQuery<GetIntentsQueryResult>(getIntentsQuery, {
    variables: { agentId: numAgentId },
  });

  const getActionsQueryData = useQuery<GetActionsQueryResult>(getActionsQuery, {
    variables: { agentId: numAgentId },
  });

  const [updateIntent, updateIntentMutationData] = useMutation(updateIntentMutation, {
    refetchQueries: [{ query: getIntentsQuery, variables: { agentId: numAgentId } }],
    awaitRefetchQueries: true,
  });

  const [deleteIntent, deleteIntentMutationData] = useMutation(deleteIntentMutation, {
      refetchQueries: [{ query: getIntentsQuery, variables: { agentId: numAgentId } }],
      awaitRefetchQueries: true,
    },
  );

  const intents: Maybe<IIntent[]> = data?.ChatbotService_intents;

  const tagsData = useQuery<TagsQueryResult>(CHATBOT_GET_TAGS, { variables: { agentId: numAgentId } });
  const tags = tagsData.data?.ChatbotService_tagTypes;

  const onEditIntent = (id: number) => {
    setCurrentIntent(id);
  };

  const onSaveIntent = async (intentData: IIntent) => {
    await updateIntent({
      variables: {
        intentId: intentData.id,
        value: intentData.value,
        defaultAction: intentData.defaultAction,
      },
    });

    setCurrentIntent(null);
    setNewIntent(false);
  };

  const onDeleteIntent = async (intentId: number) => {
    await deleteIntent({
      variables: {
        intentId,
      },
    });
  };

  const onEditIntentClose = () => {
    setCurrentIntent(null);
    setNewIntent(false);
  };

  const isLoading = loading ||
    updateIntentMutationData.loading ||
    deleteIntentMutationData.loading ||
    getActionsQueryData.loading;

  const isErrorOccurred = error ||
    updateIntentMutationData.error ||
    deleteIntentMutationData.error ||
    getActionsQueryData.error;

  return (
    <div className={classes.root}>
      <IntentsTable
        intents={intents ?? []}
        actions={getActionsQueryData.data?.ChatbotService_actions ?? []}
        loading={isLoading}
        onAdd={() => setNewIntent(true)}
        onEditIntent={onEditIntent}
        onDeleteIntent={onDeleteIntent}
      />
      {!!intents && (
        <>
          <EditIntent
            isLoading={isLoading}
            actions={getActionsQueryData.data?.ChatbotService_actions ?? []}
            intent={intents.find(x => x.id === currentIntent)}
            onEditIntentClose={onEditIntentClose}
            onSaveIntent={onSaveIntent}
            error={isErrorOccurred}
          />
          {newIntent && (
            <AddIntent
              actions={getActionsQueryData.data?.ChatbotService_actions ?? []}
              onAddIntentClose={onEditIntentClose}
              tags={tags ?? []}
            />
          )}
        </>
      )}
    </div>
  );
};

export default IntentSection;
