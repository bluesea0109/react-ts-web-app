import gql from "graphql-tag";

export const GET_CURRENT_USER = gql`
  query {
    currentUser {
      name
      email
      activeOrg {
        id
        name
      }
      activeProject {
        id
        name
      }
    }
  }
`;

export const CREATE_ORG = gql`
  mutation($name: String!) {
    createOrg(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_ACTIVE_ORG = gql`
  mutation($orgId: String!, $projectId: String) {
    updateUserActiveOrg(orgId: $orgId, projectId: $projectId) {
      name
      email
      activeOrg {
        id
        name
      }
      activeProject {
        id
        name
      }
    }
  }
`;

export const GET_PROJECTS = gql`
  query($orgId: String!) {
    projects(orgId: $orgId) {
      id
      name
    }
  }
`;

export const GET_ORGS = gql`
  query($id: String) {
    orgs(id: $id) {
      id
      name
      members {
        orgId
        uid
        memberType
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation($orgId: String!, $name: String!) {
    createProject(orgId: $orgId, name: $name) {
      id
      name
      orgId
    }
  }
`;

export const GET_CATEGORY_SETS = gql`
  query($projectId: String!) {
    ImageLabelingService_categorySets(projectId: $projectId) {
      id
      projectId
      name
      categories {
        categorySetId
        name
      }
    }
  }
`;

export const CREATE_CATEGORY_SET = gql`
  mutation($projectId: String!, $name: String!, $categories: [String!]!) {
    ImageLabelingService_createCategorySet(projectId: $projectId, name: $name, categories: $categories) {
      id
      projectId
      name
      categories {
        categorySetId
        name
      }
    }
  }
`;

export const DELETE_CATEGORY_SET = gql`
  mutation($categorySetId: Int!) {
    ImageLabelingService_deleteCategorySet(categorySetId: $categorySetId) {
      id
      projectId
      name
    }
  }
`;
