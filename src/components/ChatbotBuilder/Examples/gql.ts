import gql from 'graphql-tag';

export const createExampleMutation = gql`
  mutation($agentId: Int!, $example: ChatbotService_ExampleInput!) {
    ChatbotService_createExample(agentId: $agentId, example: $example) {
      id
      intent
      agentId
      text
      tags {
        id
        exampleId
        tagType
        start
        end
      }
    }
  }
`;

export const saveExampleMutation = gql`
  mutation($example: ChatbotService_ExampleInput!) {
    ChatbotService_updateExample(example: $example) {
      id,
      text,
      intent,
      tags {
        tagType,
        start,
        end
      }
    }
  }
`;

export const getExamplesQuery = gql`
  query ($agentId: Int!, $offset: Int, $limit: Int, $intent: String) {
    ChatbotService_examples(
      agentId: $agentId,
      offset: $offset,
      limit: $limit
      intent: $intent
    ) {
      id
      intent
      agentId
      text
      tags {
        id
        exampleId
        tagType
        start
        end
      }
    }
  }
`;
