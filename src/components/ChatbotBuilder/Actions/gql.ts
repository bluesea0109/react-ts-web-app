import gql from 'graphql-tag';
import { ActionType } from '../../../models/chatbot-service';

export const getActionsQuery = gql`
  query($agentId: Int!) {
    ChatbotService_actions(agentId: $agentId) {
      id
      agentId
      name
      type
      userResponseOptions {
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
      ... on ChatbotService_UtteranceAction {
        text
      }
    }
  }
`;

export const createActionMutation = (type: string) => {
  if (type === ActionType.UTTERANCE_ACTION) {
    return gql`
      mutation($agentId: Int!, $text: String!, $name: String!, $userResponseOptions: [Int!]) {
        ChatbotService_createUtteranceAction(agentId: $agentId, text: $text, name: $name, userResponseOptionIDs: $userResponseOptions) {
          id
          text
        }
      }
    `;
  } else {
    return gql`
        mutation {
          EmptyMutation {
            emptyField
          }
        }
    `;
  }
};

export const updateActionMutation = (type: string) => {
  if (type === ActionType.UTTERANCE_ACTION) {
    return gql`
      mutation($actionId: Int!, $text: String!, $userResponseOptions: [Int!]) {
        ChatbotService_updateUtteranceAction(id: $actionId, text: $text, userResponseOptionIDs: $userResponseOptions) {
          id
          text
        }
      }
    `;
  } else {
    return gql`
        mutation {
          EmptyMutation {
            emptyField
          }
        }
    `;
  }
};

export const deleteActionMutation = (type: string) => {
  if (type === ActionType.UTTERANCE_ACTION) {
    return gql`
      mutation($utteranceActionId: Int!) {
        ChatbotService_deleteUtteranceAction(utteranceActionId: $utteranceActionId) {
          id
          text
        }
      }
    `;
  }
};
