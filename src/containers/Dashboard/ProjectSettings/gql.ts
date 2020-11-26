import gql from 'graphql-tag';

export const getApiKeysQuery = gql`
  query($workspaceId: String!) {
    apiKey(workspaceId: $workspaceId) {
      key
      workspaceName
      workspaceId
      domains
    }
  }
`;

export const createApiKeyMutation = gql`
  mutation($workspaceId: String!, $apiKey: String) {
    generateApiKey(workspaceId: $workspaceId, key: $apiKey) {
      key
      workspaceId
      workspaceName
      domains
    }
  }
`;

export const deleteApiKeyMutation = gql`
  mutation($workspaceId: String!) {
    deleteApiKey(workspaceId: $workspaceId) {
      key
    }
  }
`;

export const updateDomainsMutation = gql`
  mutation($workspaceId: String!, $domains: [String!]!) {
    updateAllowedDomains(workspaceId: $workspaceId, domains: $domains) {
      key
      workspaceId
      workspaceName
      domains
    }
  }
`;
