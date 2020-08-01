import gql from 'graphql-tag';

export const createGraphPolicyMutation = gql`
    mutation ($agentId: Int!, $policy: ChatbotService_GraphPolicyInput!) {
      ChatbotService_createGraphPolicy(agentId: $agentId, policy: $policy) {
        id
        agentId
        name
        data
      }
    }
`;

export const updateGraphPolicyMutation = gql`
  mutation ($id: Int!, $policy: ChatbotService_GraphPolicyInput!) {
    ChatbotService_updateGraphPolicy(id: $id, policy: $policy) {
      id
      agentId
      name
      data
    }
  }
`;

export const deleteGraphPolicyMutation = gql`
    mutation ($id: Int!) {
      ChatbotService_deleteGraphPolicy(id: $id)
    }
`;

export const activateGraphPolicyMutation = gql`
    mutation ($id: Int!, $agentId: Int!) {
      ChatbotService_updateActivePolicy(id: $id, agentId: $agentId)
    }
`;

export const getGraphPoliciesQuery = gql`
    query ($agentId: Int!) {
      ChatbotService_graphPolicies(agentId: $agentId) {
        id
        name
        data
        agentId
        isActive
      }
    }
`;
