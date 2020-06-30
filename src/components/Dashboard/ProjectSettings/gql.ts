import gql from "graphql-tag";

export const getApiKeysQuery = gql`
  query ($projectId: String!) {
    apiKey(projectId: $projectId) {
      key,
      orgId,
      orgName,
      projectId,
      projectName
    }
  }
`;

export const createApiKeyMutation = gql`
  mutation ($projectId: String!) {
    generateApiKey(projectId: $projectId) {
      key,
      orgId,
      orgName,
      projectId,
      projectName
    }
  }
`;

export const deleteApiKeyMutation = gql`
  mutation ($projectId: String!) {
    deleteApiKey(projectId: $projectId) {
      key
    }
  }
`;
