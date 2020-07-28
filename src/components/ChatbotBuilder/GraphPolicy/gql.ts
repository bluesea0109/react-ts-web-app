import gql from 'graphql-tag';

export const createGraphPolicyMutation = gql`
    mutation ($agentId: Int!, $policy: ChatbotService_GraphPolicyInput!) {
      ChatbotService_createGraphPolicy(agentId: $agentId, policy: $policy) {
        id
        agentId
        name
      }
    }
`;
