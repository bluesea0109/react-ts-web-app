import { gql } from "@apollo/client";

export const UPDATE_ACTIVE_ORG = gql`
  mutation($orgId: String!, $projectId: String) {
    updateUserActiveOrg(orgId: $orgId, projectId: $projectId) {
      name,
      email,
      activeOrg {
        id,
        name
      },
      activeProject {
        id,
        name
      }
    }
  }
`