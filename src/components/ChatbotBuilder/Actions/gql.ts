import gql from 'graphql-tag';
import { ActionType } from '../../../models/chatbot-service';

export const GET_ACTIONS_QUERY = gql`
  query($agentId: Int!) {
    ChatbotService_actions(agentId: $agentId) {
      id
      agentId
      name
      type
      ... on UtteranceAction {
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
  }
}

export const updateActionMutation = (type: string) => {
  if (type === ActionType.UTTERANCE_ACTION) {
    return gql`
      mutation($utteranceActionId: Int!, $name: String!, $text: String!) {
        ChatbotService_updateUtteranceAction(utteranceActionId: $utteranceActionId, name: $name, text: $text) {
          id
          text
        }
      }
    `;
  }
}

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
}
