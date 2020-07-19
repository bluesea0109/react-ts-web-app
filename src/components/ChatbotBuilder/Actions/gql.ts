import gql from 'graphql-tag';
import { ActionType } from '../../../models/chatbot-service';

export const getActionsQuery = gql`
  query($agentId: Int!) {
    ChatbotService_actions(agentId: $agentId) {
      id
      agentId
      name
      type
      ... on ChatbotService_UtteranceAction {
        text
      }
    }
  }
`;

export const createActionMutation = (type: string) => {
  if (type === ActionType.UTTERANCE_ACTION) {
    return gql`
      mutation($agentId: Int!, $text: String!, $name: String!) {
        ChatbotService_createUtteranceAction(agentId: $agentId, text: $text, name: $name) {
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
      mutation($actionId: Int!, $text: String!) {
        ChatbotService_updateUtteranceAction(id: $actionId, text: $text) {
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
