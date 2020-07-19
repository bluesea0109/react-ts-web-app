import { useMutation, useQuery } from '@apollo/react-hooks';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { IIntent } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { getActionsQuery } from '../Actions/gql';
import { GetActionsQueryResult } from '../Actions/types';
import EditIntent from './EditIntent';
import { createIntentMutation, deleteIntentMutation, getIntentsQuery, updateIntentMutation } from './gql';
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

  const defaultIntentVal: IIntent = {
    id: -1,
    agentId: numAgentId,
    defaultAction: -1,
    value: '',
  };

  const { data, loading, error } = useQuery<GetIntentsQueryResult>(getIntentsQuery, {
    variables: { agentId: numAgentId },
  });

  const getActionsQueryData = useQuery<GetActionsQueryResult>(getActionsQuery, {
    variables: { agentId: numAgentId },
  });

  const [createIntent, createIntentMutationData] = useMutation(createIntentMutation, {
    refetchQueries: [{ query: getIntentsQuery }],
    awaitRefetchQueries: true,
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

  const onEditIntent = (id: number) => {
    setCurrentIntent(id);
  };

  const onSaveIntent = async (intentData: IIntent) => {
    if (newIntent) {
      const { value, defaultAction } = intentData;
      await createIntent({
        variables: {
          agentId: numAgentId,
          intents: [
            { value, defaultAction },
          ],
        },
      });
    } else {
      await updateIntent({
        variables: {
          intentId: intentData.id,
          value: intentData.value,
          defaultAction: intentData.defaultAction,
        },
      });
    }

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
    getActionsQueryData.loading ||
    createIntentMutationData.loading;

  const isErrorOccurred = error ||
    updateIntentMutationData.error ||
    deleteIntentMutationData.error ||
    getActionsQueryData.error ||
    createIntentMutationData.error;

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
        <EditIntent
          isLoading={isLoading}
          actions={getActionsQueryData.data?.ChatbotService_actions ?? []}
          intent={newIntent ? defaultIntentVal : intents.find(x => x.id === currentIntent)}
          onEditIntentClose={onEditIntentClose}
          onSaveIntent={onSaveIntent}
          error={isErrorOccurred}
        />
      )}
    </div>
  );
};

export default IntentSection;
