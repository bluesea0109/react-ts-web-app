import { gql } from '@apollo/client';

export const fetchAll = gql`
query {
  orgs{
    id
    name
  }
}`;

export const create = gql`
mutation ($name: String!) {
  createOrg(name: $name) {
    id
    name
  }
}
`
