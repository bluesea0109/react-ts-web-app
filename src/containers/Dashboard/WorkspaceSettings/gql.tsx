import gql from 'graphql-tag';

export const REMOVE_WORKSPACE_MEMBER = gql`
  mutation($workspaceId: String!, $userId: String!) {
    removeWorkspaceMember(workspaceId: $workspaceId, userId: $userId) {
      uid
    }
  }
`;

export const GET_INVITED_WORKSPACE_MEMBERS = gql`
  query($workspaceId: String!) {
    workspaceMemberInvites(workspaceId: $workspaceId) {
      id
      email
      workspaceId
      workspaceName
      senderName
      senderEmail
      timestamp
      role
    }
  }
`;

export const REVOKE_INVITATION = gql`
  mutation($workspaceId: String!, $inviteId: String!) {
    deleteWorkspaceMemberInvite(workspaceId: $workspaceId, inviteId: $inviteId)
  }
`;

export const INVITE_WORKSPACE_MEMBER = gql`
  mutation(
    $workspaceId: String!
    $recipientEmail: String!
    $role: WorkspaceMemberRole!
  ) {
    inviteWorkspaceMember(
      workspaceId: $workspaceId
      recipientEmail: $recipientEmail
      role: $role
    ) {
      id
    }
  }
`;

export const getApiKeysQuery = gql`
  query($workspaceId: String!) {
    apiKeys(workspaceId: $workspaceId) {
      id
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
      id
      key
      workspaceId
      workspaceName
      domains
    }
  }
`;

export const deleteApiKeyMutation = gql`
  mutation($keyId: Int!) {
    deleteApiKey(keyId: $keyId) {
      key
    }
  }
`;

export const updateDomainsMutation = gql`
  mutation($keyId: Int!, $domains: [String!]!) {
    updateAllowedDomains(keyId: $keyId, domains: $domains) {
      id
      key
      workspaceId
      workspaceName
      domains
    }
  }
`;
