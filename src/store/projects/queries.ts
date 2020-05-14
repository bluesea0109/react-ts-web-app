import { gql } from '@apollo/client';

export const fetchAll = gql`
query ($orgId: String!) {
  projects(orgId: $orgId) {
    id
    name
  }
}
`;

export const create = gql`
mutation ($orgId: String!, $name: String!) {
  createProject(orgId: $orgId, name: $name) {
    id
    name
    orgId
  }
}
`;
