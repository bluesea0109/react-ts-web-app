import gql from 'graphql-tag';

export const GET_CURRENT_USER = gql`
  query {
    currentUser {
      name
      uid
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
        currentUserMember {
          role
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
        role
        user {
          uid
          name
          email
        }
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
      userIntents {
        id
        agentId
        value
      }
      utteranceActions {
        id
        agentId
        name
        text
      }
      tagTypes{
        id
        agentId
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
      userIntents {
        id
        agentId
        value
      }
      utteranceActions {
        id
        agentId
        name
        text
      }
      tagTypes{
        id
        agentId
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
      defaultResponse
    }
  }
`;

export const CHATBOT_GET_TAGS = gql`
  query($agentId: Int!) {
    ChatbotService_tagTypes(agentId: $agentId) {
      id
      agentId
      value
    }
  }
`;

export const CHATBOT_GET_UTTERANCE_ACTIONS = gql`
  query($agentId: Int!) {
    ChatbotService_utteranceActions(agentId: $agentId) {
      id
      agentId
      name
      text
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
      # tags
      userIntents {
        id
        agentId
        value
        examples {
          id
          intentId
          agentId
          text
          tags {
            id
            exampleId
            tagTypeId
            start
            end
          }
        }
      }
      utteranceActions {
        id
        agentId
        name
        text
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

export const CHATBOT_CREATE_INTENTS = gql`
  mutation($agentId: Int!, $intents: [ChatbotService_IntentInput!]!) {
    ChatbotService_createIntents(agentId: $agentId, intents: $intents) {
      id
      agentId
      value
      defaultResponse
      examples {
        id
        intentId
        agentId
        text
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

export const CHATBOT_CREATE_TAGS = gql`
  mutation($agentId: Int!, $values: [String!]!) {
    ChatbotService_createTagTypes(agentId: $agentId, values: $values) {
      id
      agentId
      value
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

export const CHATBOT_DELETE_TAG = gql`
  mutation($tagTypeId: Int!) {
    ChatbotService_deleteTagType(tagTypeId: $tagTypeId) {
      id
      value
    }
  }
`;

export const CHATBOT_UPDATE_INTENT = gql`
  mutation($intentId: Int!, $value: String!, $defaultResponse: String) {
    ChatbotService_updateIntent(intentId: $intentId, value: $value, defaultResponse: $defaultResponse) {
      id
      agentId
      value
      examples {
        id
        intentId
        agentId
        text
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

export const CREATE_EXAMPLE = gql`
  mutation($agentId: Int!, $text: String!, $intentId: Int) {
    ChatbotService_createExample(agentId: $agentId, text: $text, intentId: $intentId) {
        id
        intentId
        agentId
        text
    }
  }
`;

export const GET_EXAMPLES = gql`
  query($agentId: Int!) {
    ChatbotService_examples(agentId: $agentId) {
        id
        intentId
        agentId
        text
        tags {
          id
          exampleId
          tagTypeId
          start
          end
          tagType {
            id
            agentId
            value
          }

        }
    }
  }
`;

export const CHATBOT_DELETE_EXAMPLE = gql`
  mutation($exampleId: Int!) {
    ChatbotService_deleteExample(exampleId: $exampleId) {
      id
    }
  }
`;

export const CHATBOT_UPDATE_EXAMPLE = gql`
  mutation($exampleId: Int!, $text: String!) {
    ChatbotService_updateExample(exampleId: $exampleId,text: $text) {
      id
    }
  }
`;

export const CREATE_EXAMPLE_TAGS = gql`
  mutation($exampleId: Int!, $tagTypeId: Int!, $start: Int!, $end: Int!) {
    ChatbotService_createExampleTag(exampleId: $exampleId,tagTypeId: $tagTypeId, start: $start,end: $end) {
      id
      exampleId
      tagTypeId
      start
      end
    }
  }
`;

export const CHATBOT_CREATE_UTTERANCE_ACTION = gql`
  mutation($agentId: Int!, $text: String!, $name: String!) {
    ChatbotService_createUtteranceAction(agentId: $agentId, name: $name, text: $text) {
      id
      agentId
      name
      text
    }
  }
`;

export const CHATBOT_DELETE_UTTERANCE_ACTION = gql`
  mutation($utteranceActionId: Int!) {
    ChatbotService_deleteUtteranceAction(utteranceActionId: $utteranceActionId) {
      id
      text
    }
  }
`;

export const CHATBOT_UPDATE_UTTERANCE_ACTION = gql `
mutation($utteranceActionId: Int!, $name: String!, $text: String!) {
  ChatbotService_updateUtteranceAction(utteranceActionId: $utteranceActionId, name: $name, text: $text) {
    id
    agentId
    name
    text
  }
}
`;

export const CHATBOT_TALK_TO_AGENT = gql`
  mutation($conversation: ChatbotService_ConversationInput!) {
    ChatbotService_talkToAgent(conversation: $conversation) {
      agentId
      dialogueTurns {
        actor
        utterance
       }
    }
  }
`;

export const GET_TRAINING_JOBS = gql`
  query($agentId: Int!) {
    ChatbotService_trainingJobs(agentId: $agentId) {
      jobId
      status
    }
  }
`;

export const CREATE_TRAINING_JOB = gql`
  mutation ($agentId: Int!) {
    ChatbotService_createNLUTrainingJob(agentId: $agentId) {
      jobId
      status
    }
  }
`;
