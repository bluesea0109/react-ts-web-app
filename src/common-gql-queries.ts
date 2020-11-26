import gql from 'graphql-tag';

export const GET_CURRENT_USER = gql`
  query {
    currentUser {
      name
      uid
      email
      workspaces {
        id
        name
        members
        billingEnabled
      }
      activeWorkspace {
        id
        name
        billingEnabled
        currentUserMember {
          role
        }
      }
    }
  }
`;

export const CREATE_WORKSPACE = gql`
  mutation($name: String!) {
    createWorkspace(name: $name) {
      id
      name
      members {
        uid
        role
      }
      billingEnabled
    }
  }
`;

export const UPDATE_ACTIVE_WORKSPACE = gql`
  mutation($workspaceId: String!) {
    updateUserActiveWorkspace(workspaceId: $workspaceId) {
      name
      email
      activeWorkspace {
        id
        name
      }
    }
  }
`;

export const CHATBOT_CREATE_SLOTS = gql`
  mutation($agentId: Int!, $slots: [ChatbotService_SlotInput!]!) {
    ChatbotService_createSlots(agentId: $agentId, slots: $slots) {
      id
      agentId
      name
      type
    }
  }
`;

export const CHATBOT_CREATE_EMAIL_ACTION = gql`
  mutation(
    $agentId: Int!
    $name: String!
    $text: String!
    $to: String!
    $from: String
    $userResponseOptionIDs: [Int!]
  ) {
    ChatbotService_createEmailAction(
      agentId: $agentId
      name: $name
      text: $text
      to: $to
      from: $from
      userResponseOptionIDs: $userResponseOptionIDs
    ) {
      agentId
      name
      id
      from
      to
      text
    }
  }
`;

export const GET_WORKSPACES = gql`
  query($id: String) {
    workspaces(id: $id) {
      id
      name
      billingEnabled
      members {
        workspaceId
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

export const GET_CATEGORY_SETS = gql`
  query($workspaceId: String!) {
    ImageLabelingService_categorySets(workspaceId: $workspaceId) {
      id
      workspaceId
      name
      categories {
        categorySetId
        name
      }
    }
  }
`;

export const CREATE_CATEGORY_SET = gql`
  mutation($workspaceId: String!, $name: String!, $categories: [String!]!) {
    ImageLabelingService_createCategorySet(
      workspaceId: $workspaceId
      name: $name
      categories: $categories
    ) {
      id
      workspaceId
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
      workspaceId
      name
    }
  }
`;

export const CHATBOT_GET_AGENTS = gql`
  query($workspaceId: String!) {
    ChatbotService_agents(workspaceId: $workspaceId) {
      id
      workspaceId
      uname
      config
      widgetSettings
    }
  }
`;

export const CHATBOT_GET_AGENT = gql`
  query($agentId: Int!) {
    ChatbotService_agent(agentId: $agentId) {
      id
      workspaceId
      uname
      config
      widgetSettings
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
      text
    }
  }
`;

export const CHATBOT_CREATE_AGENT = gql`
  mutation($workspaceId: String!, $uname: String!, $config: JSON) {
    ChatbotService_createAgent(
      workspaceId: $workspaceId
      uname: $uname
      config: $config
    ) {
      id
      workspaceId
      uname
      config
      widgetSettings
    }
  }
`;

export const CHATBOT_DELETE_AGENT = gql`
  mutation($agentId: Int!) {
    ChatbotService_deleteAgent(agentId: $agentId) {
      id
      workspaceId
    }
  }
`;

export const CHATBOT_UPDATE_AGENT = gql`
  mutation($agentId: Int!, $config: JSON!) {
    ChatbotService_updateAgent(agentId: $agentId, config: $config) {
      id
      uname
      config
      widgetSettings
    }
  }
`;

export const CHATBOT_SAVE_CONFIG_AND_SETTINGS = gql`
  mutation($agentId: Int!, $config: JSON!, $uname: String!, $settings: JSON!) {
    ChatbotService_updateAgent(agentId: $agentId, config: $config) {
      id
      uname
      config
      widgetSettings
    }
    ChatbotService_updateWidgetSettings(uname: $uname, settings: $settings)
  }
`;

export const CHATBOT_CREATE_TAGS = gql`
  mutation($agentId: Int!, $values: [String!]!, $upsert: Boolean) {
    ChatbotService_createTagTypes(
      agentId: $agentId
      values: $values
      upsert: $upsert
    ) {
      id
      agentId
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

export const CREATE_EXAMPLE = gql`
  mutation($agentId: Int!, $text: String!, $intentId: Int) {
    ChatbotService_createExample(
      agentId: $agentId
      text: $text
      intentId: $intentId
    ) {
      id
      intentId
      agentId
      text
    }
  }
`;

export const GET_EXAMPLES = gql`
  query($agentId: Int!) {
    ChatbotService_intents(agentId: $agentId) {
      id
      value
    }
    ChatbotService_examples(agentId: $agentId) {
      data {
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
      total
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
    ChatbotService_updateExample(exampleId: $exampleId, text: $text) {
      id
    }
  }
`;

export const CREATE_EXAMPLE_TAGS = gql`
  mutation($exampleId: Int!, $tagTypeId: Int!, $start: Int!, $end: Int!) {
    ChatbotService_createExampleTag(
      exampleId: $exampleId
      tagTypeId: $tagTypeId
      start: $start
      end: $end
    ) {
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
    ChatbotService_createUtteranceAction(
      agentId: $agentId
      text: $text
      name: $name
    ) {
      id
      text
    }
  }
`;

export const CHATBOT_DELETE_UTTERANCE_ACTION = gql`
  mutation($utteranceActionId: Int!) {
    ChatbotService_deleteUtteranceAction(
      utteranceActionId: $utteranceActionId
    ) {
      id
      text
    }
  }
`;

export const CHATBOT_UPDATE_UTTERANCE_ACTION = gql`
  mutation($utteranceActionId: Int!, $name: String!, $text: String!) {
    ChatbotService_updateUtteranceAction(
      utteranceActionId: $utteranceActionId
      name: $name
      text: $text
    ) {
      id
      text
    }
  }
`;

export const CHATBOT_TALK_TO_AGENT = gql`
  mutation($uname: String!, $conversation: ChatbotService_ConversationInput!) {
    ChatbotService_talkToAgent(uname: $uname, conversation: $conversation) {
      agentId
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
  mutation($agentId: Int!) {
    ChatbotService_createNLUTrainingJob(agentId: $agentId) {
      jobId
      status
    }
  }
`;

export const CREATE_TRAINING_CONVERSATION = gql`
  mutation($conversation: ChatbotService_TrainingConversationInput!) {
    ChatbotService_createTrainingConversation(conversation: $conversation) {
      agentId
      userActions {
        turn
        intent
        tagValues {
          tagType
          value
        }
        utterance
      }
      agentActions {
        turn
        actionName
      }
    }
  }
`;

export const GET_TRAINING_CONVERSATIONS = gql`
  query($agentId: Int!) {
    ChatbotService_trainingConversations(agentId: $agentId) {
      agentId
      id
      userActions {
        turn
        tagValues {
          tagType
          value
        }
        intent
        utterance
      }
      agentActions {
        turn
        actionName
      }
    }
  }
`;

export const UPDATE_TRAINING_CONVERSATION = gql`
  mutation(
    $conversationId: Int!
    $conversation: ChatbotService_TrainingConversationInput!
  ) {
    ChatbotService_updateTrainingConversation(
      conversationId: $conversationId
      conversation: $conversation
    ) {
      id
      agentId
      userActions {
        turn
        intent
        tagValues {
          tagType
          value
        }
        utterance
      }
      agentActions {
        turn
        actionName
      }
    }
  }
`;

export const DELETE_TRAINING_CONVERSATION = gql`
  mutation($conversationId: Int!) {
    ChatbotService_deleteTrainingConversation(conversationId: $conversationId)
  }
`;

export const GET_SIGNED_IMG_UPLOAD_URL = gql`
  query($agentId: Int!, $basename: String!) {
    ChatbotService_imageOptionUploadUrl(
      agentId: $agentId
      basename: $basename
    ) {
      url
    }
  }
`;

export const GET_OPTION_IMAGES_QUERY = gql`
  query($agentId: Int!) {
    ChatbotService_optionImages(agentId: $agentId) {
      url
      name
    }
  }
`;
