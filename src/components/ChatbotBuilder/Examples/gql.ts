import gql from 'graphql-tag';

export const createExampleMutation = gql`
  mutation($agentId: Int!, $example: ChatbotService_ExampleInput!) {
    ChatbotService_createExample(agentId: $agentId, example: $example) {
      id
      intentId
      agentId
      text
      tags {
        id
        exampleId
        tagTypeId
        start
        end
        tagType {
          id
          agentId
          value
        }
      }
    }
  }
`;

export const saveExampleMutation = gql`
  mutation($example: ChatbotService_ExampleInput!) {
    ChatbotService_updateExample(example: $example) {
      id,
      text,
      intentId,
      tags {
        tagTypeId,
        start,
        end
      }
    }
  }
`;

export const getIntentsQuery = gql`
  query ($agentId: Int!) {
    ChatbotService_intents(agentId: $agentId) {
      id,
      agentId,
      value
    }
  }
`;

export const getExamplesQuery = gql`
  query ($agentId: Int!, $offset: Int, $limit: Int, $intentId: Int) {
    ChatbotService_examples(
      agentId: $agentId,
      offset: $offset,
      limit: $limit
      intentId: $intentId
    ) {
      id
      intentId
      agentId
      text
      tags {
        id
        exampleId
        tagTypeId
        start
        end
        tagType {
          id
          agentId
          value
        }
      }
    }
  }
`;
