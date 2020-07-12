import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useParams } from 'react-router';
import { CHATBOT_DELETE_EXAMPLE, CHATBOT_GET_TAGS } from '../../../common-gql-queries';
import { IExample } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import EditExample from './EditExample';
import ExamplesTable from './ExamplesTable';
import { ExamplesFilter, ExamplesQueryResults, IntentsQueryResults, TagsQueryResult } from './types';
import { getExamplesQuery, getIntentsQuery, saveExampleMutation } from './gql';

export const EXAMPLES_LIMIT = 10;

const Examples = () => {
  const { agentId } = useParams();

  const [currentEdit, setCurrentEdit] = useState<number | null>();
  const [filters, setFilters] = useState<ExamplesFilter>();
  const [rendered, rerender] = useState(false);

  useEffect(() => {
    if (rendered) {
      rerender(false);
    }
  }, [rendered])

  const numAgentId = Number(agentId);

  const tagsData = useQuery<TagsQueryResult>(CHATBOT_GET_TAGS, { variables: { agentId: numAgentId } });
  const intentsData = useQuery<IntentsQueryResults>(getIntentsQuery, { variables: { agentId: numAgentId } });

  const examplesData = useQuery<ExamplesQueryResults>(getExamplesQuery, {
    variables: {
      agentId: numAgentId,
      limit: EXAMPLES_LIMIT,
      offset: filters?.offset,
      intentId: filters?.intentId
    }
  });

  const tags = tagsData.data?.ChatbotService_tagTypes;
  const intents = intentsData.data?.ChatbotService_intents;
  let examples = examplesData.data?.ChatbotService_examples;

  const [deleteExample, deleteExampleMutation] = useMutation(CHATBOT_DELETE_EXAMPLE, {
    refetchQueries: [
      {
        query: getExamplesQuery,
        variables: {
          agentId: numAgentId,
          limit: EXAMPLES_LIMIT,
          offset: filters?.offset,
          intentId: filters?.intentId
        }
      },
    ],
    awaitRefetchQueries: true,
  });

  const [updateExample, updateExampleMutation] = useMutation<ExamplesQueryResults>(saveExampleMutation, {
    refetchQueries: [
      {
        query: getExamplesQuery,
        variables: {
          agentId: numAgentId,
          limit: EXAMPLES_LIMIT,
          offset: filters?.offset,
          intentId: filters?.intentId
        }
      },
    ],
    awaitRefetchQueries: true,
  })

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
        tagTypeId: tag.tagType.id
      }))
    };

    await updateExample({
      variables: {
        example
      }
    });

    setCurrentEdit(null);
  };

  const loading = examplesData.loading || deleteExampleMutation.loading || updateExampleMutation.loading;

  return (
    <>
      <ExamplesTable
        loading={loading}
        updateFilters={(newFilters: ExamplesFilter) => setFilters({ ...filters, ...newFilters })}
        examples={examples}
        intents={intents}
        filters={filters}
        onDelete={onExampleDelete}
        onEdit={onExampleEdit}
      />
      {!!currentEdit && (
        <EditExample
          loading={loading}
          tags={tags}
          intents={intents}
          example={examples?.find(ex => ex.id === currentEdit)}
          onEditExampleClose={onExampleEditClose}
          onSaveExample={onExampleSave}
        />
      )}
    </>
  );
};

export default Examples;
