import gql from 'graphql-tag';

export const getApiKeysQuery = gql`
  query($projectId: String!) {
    apiKey(projectId: $projectId) {
      key
      orgId
      orgName
      projectId
      projectName
      domains
    }
  }
`;

export const createApiKeyMutation = gql`
  mutation($projectId: String!, $apiKey: String) {
    generateApiKey(projectId: $projectId, key: $apiKey) {
      key
      orgId
      orgName
      projectId
      projectName
      domains
    }
  }
`;

export const deleteApiKeyMutation = gql`
  mutation($projectId: String!) {
    deleteApiKey(projectId: $projectId) {
      key
    }
  }
`;

export const updateDomainsMutation = gql`
  mutation($projectId: String!, $domains: [String!]!) {
    updateAllowedDomains(projectId: $projectId, domains: $domains) {
      key
      orgId
      orgName
      projectId
      projectName
      domains
    }
  }
`;
