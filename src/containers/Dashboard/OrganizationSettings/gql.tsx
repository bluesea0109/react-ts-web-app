import gql from 'graphql-tag';

export const REMOVE_ORG_MEMBER = gql`
  mutation($orgId: String!, $userId: String!) {
    removeOrgMember(orgId: $orgId, userId: $userId) {
      uid
    }
  }
`;

export const GET_INVITED_ORG_MEMBERS = gql`
    query($orgId: String!) {
        orgMemberInvites(orgId: $orgId){
            id
            email
            orgId
            orgName
            senderName
            senderEmail
            timestamp
            role
        }
    }
`;

export const REVOKE_INVITATION = gql`
  mutation($orgId: String!, $inviteId: String!) {
    deleteOrgMemberInvite(
      orgId: $orgId
      inviteId: $inviteId
    )
  }
`;

export const INVITE_ORG_MEMBER = gql`
  mutation($orgId: String!, $recipientEmail: String!, $role: OrgMemberRole!) {
    inviteOrgMember(
      orgId: $orgId
      recipientEmail: $recipientEmail
      role: $role
    ) {
      id
    }
  }
`;

export const ENABLE_BILLING = gql`
  mutation($orgId: String!, $stripeToken: String!, $billingEmail: String!) {
    BillingService_enableBilling(
      orgId: $orgId
      stripeToken: $stripeToken
      billingEmail: $billingEmail
    )
  }
`;

export const DISABLE_BILLING = gql`
  mutation($orgId: String!) {
    BillingService_disableBilling(
      orgId: $orgId
    )
  }
`;
