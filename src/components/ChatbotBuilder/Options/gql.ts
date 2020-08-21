import gql from 'graphql-tag';

export const createOptionMutation = gql`
  mutation($agentId: Int!, $userTextResponseOption: ChatbotService_TextOptionInput, $userImageResponseOption: ChatbotService_ImageOptionInput) {
    ChatbotService_createUserResponseOption(agentId: $agentId, userTextResponseOption: $userTextResponseOption, userImageResponseOption: $userImageResponseOption) {
      id
      type
      ... on ChatbotService_TextOption {
        intentId
        intent
        text
      }
      ... on ChatbotService_ImageOption {
        intentId
        intent
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
      type
      ... on ChatbotService_TextOption {
        intentId
        intent
        text
      }
      ... on ChatbotService_ImageOption {
        intentId
        intent
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
      type
      ... on ChatbotService_TextOption {
        intentId
        intent
        text
      }
      ... on ChatbotService_ImageOption {
        intentId
        intent
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
      type
      ... on ChatbotService_TextOption {
        intentId
        intent
        text
      }
      ... on ChatbotService_ImageOption {
        intentId
        intent
        imageUrl
        text
      }
    }
  }
`;
