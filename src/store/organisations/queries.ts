import gql from 'graphql-tag';

export const fetchAll = gql`
  query {
    orgs{
      id
      name
    }
  }
`;

export const create = gql`
  mutation ($name: String!) {
    createOrg(name: $name) {
      id
      name
    }
  }
`;

export const updateActiveProject = gql`
  mutation ($orgId: String!, $projectId: String!) {
    updateUserActiveOrg(orgId: $orgId,projectId: $projectId) {
      uid
    }
  }
`;
