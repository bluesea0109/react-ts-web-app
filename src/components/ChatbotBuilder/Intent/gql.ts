import gql from 'graphql-tag';

export const createIntentMutation = gql`
  mutation($agentId: Int!, $intents: [ChatbotService_IntentInput!]!) {
    ChatbotService_createIntents(agentId: $agentId, intents: $intents) {
      id
      agentId
      value
      defaultAction
    }
  }
`;

export const getIntentsQuery = gql`
  query($agentId: Int!) {
    ChatbotService_intents(agentId: $agentId) {
      id
      agentId
      value
      defaultAction
    }
  }
`;

export const updateIntentMutation = gql`
  mutation($intentId: Int!, $value: String!, $defaultAction: Int) {
    ChatbotService_updateIntent(intentId: $intentId, value: $value, defaultAction: $defaultAction) {
      id
      agentId
      value
      examples {
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
        }
      }
    }
  }
`;

export const deleteIntentMutation = gql`
  mutation($intentId: Int!) {
    ChatbotService_deleteIntent(intentId: $intentId) {
      id
      value
    }
  }
`;
