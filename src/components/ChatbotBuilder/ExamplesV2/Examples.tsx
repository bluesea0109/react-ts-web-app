import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useParams } from 'react-router';
import { CHATBOT_DELETE_EXAMPLE, CHATBOT_GET_TAGS } from '../../../common-gql-queries';
import { IExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import ApolloErrorPage from '../../ApolloErrorPage';
import EditExample from './EditExample';
import ExamplesTable from './ExamplesTable';
import { createExampleMutation, getExamplesQuery, getIntentsQuery, saveExampleMutation } from './gql';
import NewExampleDialog from './NewExampleDialog';
import {
  CreateExampleMutationResult, ExamplesError,
  ExamplesFilter,
  ExamplesQueryResults,
  IntentsQueryResults,
  TagsQueryResult,
} from './types';

export const EXAMPLES_LIMIT = 10;

const Examples = () => {
  const { agentId } = useParams();

  const [currentEdit, setCurrentEdit] = useState<number | null>();
  const [filters, setFilters] = useState<ExamplesFilter>();
  const [rendered, rerender] = useState(false);
  const [newExample, setNewExample] = useState<IExample | null>(null);
  const [showNewExampleDialog, setShowNewExampleDialog] = useState(false);
  const [exampleError, setExampleError] = useState<Maybe<ExamplesError>>();

  useEffect(() => {
    if (rendered) {
      rerender(false);
    }
  }, [rendered]);

  const numAgentId = Number(agentId);

  const tagsData = useQuery<TagsQueryResult>(CHATBOT_GET_TAGS, { variables: { agentId: numAgentId } });
  const intentsData = useQuery<IntentsQueryResults>(getIntentsQuery, { variables: { agentId: numAgentId } });

  const examplesData = useQuery<ExamplesQueryResults>(getExamplesQuery, {
    variables: {
      agentId: numAgentId,
      limit: EXAMPLES_LIMIT,
      offset: filters?.offset,
      intentId: filters?.intentId,
    },
  });

  const tags = tagsData.data?.ChatbotService_tagTypes;
  const intents = intentsData.data?.ChatbotService_intents;
  const examples = examplesData.data?.ChatbotService_examples;

  const [deleteExample, deleteExampleMutation] = useMutation(CHATBOT_DELETE_EXAMPLE, {
    refetchQueries: [
      {
        query: getExamplesQuery,
        variables: {
          agentId: numAgentId,
          limit: EXAMPLES_LIMIT,
          offset: filters?.offset,
          intentId: filters?.intentId,
        },
      },
    ],
    awaitRefetchQueries: true,
  });

  const [updateExample, updateExampleMutation] = useMutation(saveExampleMutation, {
    refetchQueries: [
      {
        query: getExamplesQuery,
        variables: {
          agentId: numAgentId,
          limit: EXAMPLES_LIMIT,
          offset: filters?.offset,
          intentId: filters?.intentId,
        },
      },
    ],
    awaitRefetchQueries: true,
  });

  const [createExample, createExampleMutationData] = useMutation<CreateExampleMutationResult>(createExampleMutation, {
    variables: {
      agentId: numAgentId,
    },
  });

  const commonError = examplesData.error || deleteExampleMutation.error || updateExampleMutation.error;
  if (commonError) {
    return <ApolloErrorPage error={commonError} />;
  }

  const onExampleEdit = (exampleID: number) => {
    setCurrentEdit(exampleID);
  };

  const onExampleDelete = async (exampleId: number) => {
    await deleteExample({
      variables: {
        exampleId,
      },
    });
  };

  const onExampleEditClose = () => {
    setCurrentEdit(null);
  };

  const onExampleSave = async (updatedExample: IExample) => {
    const example = {
      id: updatedExample.id,
      text: updatedExample.text,
      intentId: updatedExample.intentId,
      tags: updatedExample.tags.map((tag: any) => ({
        start: tag.start,
        end: tag.end,
        tagTypeId: tag.tagType.id,
      })),
    };

    await updateExample({
      variables: {
        example,
      },
    });

    setCurrentEdit(null);
    setNewExample(null);
  };

  const loading = examplesData.loading ||
    deleteExampleMutation.loading ||
    updateExampleMutation.loading ||
    createExampleMutationData.loading;

  const createNewExample = async (text: string, intent: Maybe<number> = null) => {
    setExampleError(null);
    try {
      const data = await createExample({
        variables: {
          text,
          intent,
        },
      });
      setShowNewExampleDialog(false);
      setNewExample(data.data?.ChatbotService_createExample ?? null);
    } catch (e) {
      if (`${e}`.indexOf('duplicate key') !== -1) {
        setExampleError(ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE);
      }
    }
  };

  const updateFilters = (newFilters: ExamplesFilter) => {
    const resetIntent = !!filters?.intentId && !newFilters.intentId;
    const changeIntent = !!newFilters?.intentId && filters?.intentId !== newFilters?.intentId;

    if (resetIntent || changeIntent) {
      newFilters['offset'] = 0;
    }

    setFilters({ ...filters, ...newFilters });
  };

  return (
    <>
      <ExamplesTable
        loading={loading}
        updateFilters={updateFilters}
        examples={examples}
        intents={intents}
        filters={filters}
        onDelete={onExampleDelete}
        onEdit={onExampleEdit}
        onAdd={() => setShowNewExampleDialog(true)}
      />
      {(!!intents && !!tags && (examples?.length ?? 0) >= 1) && (
        <EditExample
          loading={loading}
          tags={tags}
          intents={intents}
          example={!!newExample ? newExample : examples?.find(ex => ex.id === currentEdit)}
          onEditExampleClose={onExampleEditClose}
          onSaveExample={onExampleSave}
        />
      )}
      <NewExampleDialog
        loading={loading}
        intents={intents ?? []}
        isOpen={showNewExampleDialog}
        onClose={() => setShowNewExampleDialog(false)}
        onCreate={createNewExample}
        error={exampleError}
      />
    </>
  );
};

export default Examples;
