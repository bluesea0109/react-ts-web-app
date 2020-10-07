import gql from 'graphql-tag';

export const publishAgentMutation = gql`
  mutation($agentId: Int!, $forceRetrain: Boolean!) {
    ChatbotService_publishAgent(agentId: $agentId, forceRetrain: $forceRetrain) {
      id
      agentId
      status
      createdAt
      config
    }
  }
`;

export const getPublishedAgentsQuery = gql`
  query($agentId: Int!, $id: Int) {
    ChatbotService_getPublishedAgents(agentId: $agentId, id: $id) {
      id
      agentId
      status
      createdAt
      config
    }
  }
`;
