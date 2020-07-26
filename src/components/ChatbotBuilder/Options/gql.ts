import gql from 'graphql-tag';

export const createOptionMutation = gql`
  mutation($agentId: Int!, $userTextResponseOption: ChatbotService_TextOptionInput, $userImageResponseOption: ChatbotService_ImageOptionInput) {
    ChatbotService_createUserResponseOption(agentId: $agentId, userTextResponseOption: $userTextResponseOption, userImageResponseOption: $userImageResponseOption) {
      id
      intentId
      intent
      type
      ... on ChatbotService_TextOption {
        text
      }
      ... on ChatbotService_ImageOption {
        imageUrl
        text
      }
    }
  }
`;

export const getImageOptionUploadUrlQuery = gql`
    query($agentId: Int!, $basename: String!) {
      ChatbotService_imageOptionUploadUrl(agentId: $agentId, basename: $basename) {
        url
      }
    }
`;

export const getOptionsQuery = gql`
  query($agentId: Int!, $type: ChatbotService_OptionType) {
    ChatbotService_userResponseOptions(agentId: $agentId, type: $type) {
      id
      intentId
      intent
      type
      ... on ChatbotService_TextOption {
        text
      }
      ... on ChatbotService_ImageOption {
        imageUrl
        text
      }
    }
  }
`;

export const updateOptionMutation = gql`
  mutation($id: Int!, $userTextResponseOption: ChatbotService_TextOptionInput, $userImageResponseOption: ChatbotService_ImageOptionInput) {
    ChatbotService_updateUserResponseOption(id: $id, userTextResponseOption: $userTextResponseOption, userImageResponseOption: $userImageResponseOption) {
      id
      intentId
      intent
      type
      ... on ChatbotService_TextOption {
        text
      }
      ... on ChatbotService_ImageOption {
        imageUrl
        text
      }
    }
  }
`;

export const deleteOptionMutation = gql`
  mutation($id: Int!) {
    ChatbotService_deleteUserResponseOption(id: $id) {
      id
      intentId
      intent
      type
      ... on ChatbotService_TextOption {
        text
      }
      ... on ChatbotService_ImageOption {
        imageUrl
        text
      }
    }
  }
`;
