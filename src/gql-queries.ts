import { gql } from "@apollo/client";

export const CREATE_ORG = gql`
  mutation ($name: String!) {
    createOrg(name: $name) {
      id
      name
    }
  }
`;

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

export const GET_PROJECTS = gql`
  query ($orgId: String!) {
    projects(orgId: $orgId) {
      id
      name
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation ($orgId: String!, $name: String!) {
    createProject(orgId: $orgId, name: $name) {
      id
      name
      orgId
    }
  }
`
