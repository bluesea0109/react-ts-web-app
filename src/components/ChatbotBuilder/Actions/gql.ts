import gql from 'graphql-tag';

export const GET_ACTIONS_QUERY = gql`
  query($agentId: Int!) {
    ChatbotService_actions(agentId: $agentId) {
      id
      agentId
      name
      type
      ... on UtteranceAction {
        text
      }
    }
  }
`;
