import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CHATBOT_DELETE_EXAMPLE, CHATBOT_GET_TAGS } from '../../../common-gql-queries';
import { IExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import ApolloErrorPage from '../../ApolloErrorPage';
import AddExamples from './AddExamples';
import EditExample from './EditExample';
import ExamplesTable from './ExamplesTable';
import { createExampleMutation, getExamplesQuery, getIntentsQuery, saveExampleMutation } from './gql';
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

  const refetchOptions = {
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
  };

  const [deleteExample, deleteExampleMutation] = useMutation(CHATBOT_DELETE_EXAMPLE, {
    ...refetchOptions,
  });

  const [updateExample, updateExampleMutation] = useMutation(saveExampleMutation, {
    ...refetchOptions,
  });

  const [createExample, createExampleMutationData] = useMutation<CreateExampleMutationResult>(createExampleMutation, {
    ...refetchOptions,
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
    setNewExample(null);
  };

  const onExampleSave = async (updatedExample: IExample) => {
    const example = {
      ...(updatedExample.id === -1 ? {} : { id: updatedExample.id }),
      text: updatedExample.text,
      intentId: updatedExample.intentId,
      tags: updatedExample.tags.map((tag: any) => ({
        start: tag.start,
        end: tag.end,
        tagTypeId: tag.tagType.id,
      })),
    };

    const mutationOpts = {
      variables: {
        example,
        agentId: numAgentId,
      },
    };

    let resp: any;

    try {
      if (updatedExample.id === -1) {
        resp = await createExample(mutationOpts);
      } else {
        resp = await updateExample(mutationOpts);
      }

      if (!!createExampleMutationData.error) {
        if (createExampleMutationData.error.message.indexOf('duplicate key') !== -1) {
          setExampleError(ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE);
        }
      } else if (!!updateExampleMutation.error) {
        if (updateExampleMutation.error.message.indexOf('duplicate key') !== -1) {
          setExampleError(ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE);
        }
      } else if (!!resp.errors?.[0]) {
        if (resp.errors[0].message.indexOf('duplicate key') !== -1) {
          setExampleError(ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE);
        }
      } else {
        onExampleEditClose();
      }
    } catch (e) {
      if (`${e}`.indexOf('duplicate key') !== -1) {
        setExampleError(ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE);
      }
    }
  };

  const loading = examplesData.loading ||
    deleteExampleMutation.loading ||
    updateExampleMutation.loading ||
    createExampleMutationData.loading;

  const updateFilters = (newFilters: ExamplesFilter) => {
    const resetIntent = !!filters?.intentId && !newFilters.intentId;
    const changeIntent = !!newFilters?.intentId && filters?.intentId !== newFilters?.intentId;

    if (resetIntent || changeIntent) {
      newFilters['offset'] = 0;
    }

    setFilters({ ...filters, ...newFilters });
  };

  const startNewExample = () => {
    setNewExample({
      id: -1,
      intentId: null,
      agentId,
      tags: [],
      text: '',
    });
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
        onAdd={startNewExample}
      />
      {(!!intents && !!tags) && (
        <>
          <EditExample
            loading={loading}
            tags={tags}
            intents={intents}
            example={examples?.find(ex => ex.id === currentEdit)}
            onEditExampleClose={onExampleEditClose}
            onSaveExample={onExampleSave}
            error={exampleError}
          />
          {!!newExample && (
            <AddExamples
              intents={intents}
              tags={tags}
              onEditExampleClose={onExampleEditClose}
              refetchOptions={refetchOptions}
            />
          )}
        </>
      )}
    </>
  );
};

export default Examples;
