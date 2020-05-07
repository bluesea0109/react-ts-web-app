import { gql } from "@apollo/client";

export const updateActiveOrg = gql`
mutation ($orgId: String!) {
  updateUserActiveOrg(orgId: $orgId) {
    uid
  }
}
`
export const currentUser = gql`
  query {
    currentUser{
      activeOrgId
      activeProjectId
    }
  }
`
