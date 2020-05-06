import { gql } from "@apollo/client";

export const updateActiveOrg = gql`
mutation ($orgId: String!) {
  updateUserActiveOrg(orgId: $orgId) {
    uid
  }
}
`
export const fetch = gql`
query {
  currentUser{
    activeOrgId
    activeProjectId
  }
}
`
