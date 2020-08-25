import gql from 'graphql-tag';

export const publishAgentMutation = gql`
  mutation($agentId: Int!) {
    ChatbotService_publishAgent(agentId: $agentId) {
      id
      agentId
      status
      createdAt
      dialogueConfig
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
      dialogueConfig
    }
  }
`;
