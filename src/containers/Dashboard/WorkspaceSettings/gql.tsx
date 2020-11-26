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

export const ENABLE_BILLING = gql`
  mutation(
    $workspaceId: String!
    $stripeToken: String!
    $billingEmail: String!
  ) {
    enableBilling(
      workspaceId: $workspaceId
      stripeToken: $stripeToken
      billingEmail: $billingEmail
    )
  }
`;

export const DISABLE_BILLING = gql`
  mutation($workspaceId: String!) {
    disableBilling(workspaceId: $workspaceId)
  }
`;

export const getApiKeysQuery = gql`
  query($workspaceId: String!) {
    apiKeys(workspaceId: $workspaceId) {
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
  mutation($keyId: String!) {
    deleteApiKey(keyId: $keyId) {
      key
    }
  }
`;

export const updateDomainsMutation = gql`
  mutation($keyId: String!, $domains: [String!]!) {
    updateAllowedDomains(keyId: $keyId, domains: $domains) {
      key
      workspaceId
      workspaceName
      domains
    }
  }
`;
