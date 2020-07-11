import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useMutation, useQuery } from 'react-apollo';
import { CHATBOT_DELETE_EXAMPLE, CHATBOT_GET_TAGS, GET_EXAMPLES } from '../../../common-gql-queries';
import { ExampleQueryResults, TagsQueryResult } from './types';
import ContentLoading from '../../ContentLoading';
import ApolloErrorPage from '../../ApolloErrorPage';
import ExamplesTable from './ExamplesTable';
import EditExample from './EditExample';
import { IExample } from '../../../models/chatbot-service';

const Examples = () => {
  const { agentId } = useParams();

  const [currentEdit, setCurrentEdit] = useState<number | null>();

  const numAgentId = Number(agentId);

  const tagsData = useQuery<TagsQueryResult>(CHATBOT_GET_TAGS, { variables: { agentId: numAgentId } });
  const examplesData = useQuery<ExampleQueryResults>(GET_EXAMPLES, { variables: { agentId: numAgentId } });

  const tags = tagsData.data?.ChatbotService_tagTypes;
  console.log(tags);
  const examples = examplesData.data?.ChatbotService_examples;
  const intents = examplesData.data?.ChatbotService_intents;

  const [deleteExample, { loading, error }] = useMutation(CHATBOT_DELETE_EXAMPLE, {
    refetchQueries: [
      { query: GET_EXAMPLES, variables: { agentId: numAgentId } }
    ],
    awaitRefetchQueries: true,
  });

  if (examplesData.loading || loading ) {
    return <ContentLoading />;
  }

  const commonError = examplesData.error || error;
  if (commonError) {
    return <ApolloErrorPage error={commonError} />;
  }

  const onExampleEdit = (exampleID: number) => {
    setCurrentEdit(exampleID);
  }

  const onExampleDelete = async (exampleId: number) => {
    await deleteExample({
      variables: {
        exampleId,
      }
    });
  };

  const onExampleEditClose = () => {
    setCurrentEdit(null);
  };

  const onExampleSave = async (updatedExample: IExample) => {
    console.log(updatedExample);
  };

  return (
    <>
      <ExamplesTable
        examples={examples}
        intents={intents}
        onDelete={onExampleDelete}
        onEdit={onExampleEdit}
      />
      {!!currentEdit && (
        <EditExample
          example={examples?.find(ex => ex.id === currentEdit)}
          onEditExampleClose={onExampleEditClose}
          onSaveExample={onExampleSave}
        />
      )}
    </>
  )
};

export default Examples;