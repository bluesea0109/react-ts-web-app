import gql from 'graphql-tag';

export const GET_CURRENT_USER = gql`
  query {
    currentUser {
      name
      email
      orgs {
        id
        name
        projects {
          id
          name
        }
      }
      activeOrg {
        id
        name
        projects {
          id
          name
        }
      }
      activeProject {
        id
        orgId
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
    ImageLabelingService_createCategorySet(
      projectId: $projectId
      name: $name
      categories: $categories
    ) {
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

export const CHATBOT_GET_AGENTS = gql`
  query($projectId: String!) {
    ChatbotService_agents(projectId: $projectId) {
      id
      projectId
      name
      language
      tags
      userIntents {
        id
        agentId
        value
        examples {
          id
          intentId
          agentId
          value
          tags {
            id
            exampleId
            tagTypeId
            start
            end
          }
        }
      }
      templates {
        id
        agentId
        name
        value
      }
    }
  }
`;

export const CHATBOT_GET_AGENT = gql`
  query($agentId: Int!) {
    ChatbotService_agent(agentId: $agentId) {
      id
      projectId
      name
      language
      tags
      userIntents {
        id
        agentId
        value
        examples {
          id
          intentId
          agentId
          value
          tags {
            id
            exampleId
            tagTypeId
            start
            end
          }
        }
      }
      templates {
        id
        agentId
        name
        value
      }
    }
  }
`;

export const CHATBOT_GET_INTENTS = gql`
  query($agentId: Int!) {
    ChatbotService_intents(agentId: $agentId) {
      id
      agentId
      value
      examples {
        id
        intentId
        agentId
        value
        tags {
          id
          exampleId
          tagTypeId
          start
          end
        }
      }
    }
  }
`;

export const CHATBOT_CREATE_AGENT = gql`
  mutation(
    $projectId: String!
    $name: String!
    $language: ChatbotService_LanguageEnum!
  ) {
    ChatbotService_createAgent(
      projectId: $projectId
      name: $name
      language: $language
    ) {
      id
      projectId
      name
      language
      tags
      userIntents {
        id
        agentId
        value
        examples {
          id
          intentId
          agentId
          value
          tags {
            id
            exampleId
            tagTypeId
            start
            end
          }
        }
      }
      templates {
        id
        agentId
        name
        value
      }
    }
  }
`;

export const CHATBOT_DELETE_AGENT = gql`
  mutation($agentId: Int!) {
    ChatbotService_deleteAgent(agentId: $agentId) {
      id
      projectId
      name
    }
  }
`;

export const CHATBOT_UPDATE_AGENT = gql`
  mutation($agentId: Int!, $name: String!) {
    ChatbotService_updateAgent(agentId: $agentId, name: $name) {
      id
      name
    }
  }
`;

export const CHATBOT_CREATE_INTENT = gql`
  mutation($agentId: Int!, $value: String!) {
    ChatbotService_createIntent(agentId: $agentId, value: $value) {
      id
      agentId
      value
      examples {
        id
        intentId
        agentId
        value
        tags {
          id
          exampleId
          tagTypeId
          start
          end
        }
      }
    }
  }
`;

export const CHATBOT_DELETE_INTENT = gql`
  mutation($intentId: Int!) {
    ChatbotService_deleteIntent(intentId: $intentId) {
      id
      value
    }
  }
`;

export const CHATBOT_UPDATE_INTENT = gql`
  mutation($intentId: Int!, $value: String!) {
    ChatbotService_updateIntent(intentId: $intentId, value: $value) {
      id
      agentId
      value
      examples {
        id
        intentId
        agentId
        value
        tags {
          id
          exampleId
          tagTypeId
          start
          end
        }
      }
    }
  }
`;
