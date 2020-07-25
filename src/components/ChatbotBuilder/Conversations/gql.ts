import gql from 'graphql-tag';

export const getLiveConversationsQuery = gql`
  query($agentId: Int!) {
    ChatbotService_liveConversations(agentId: $agentId) {
      id
      agentId
      turns {
        ... on ChatbotService_UserAction {
          intent
          utterance
          tagValues {
            tagType
            value
          }
        }
        ... on ChatbotService_AgentAction {
          action {
            id
            agentId
            name
            type
            userResponseOptions {
              id
              actionId
              intentId
              intent
              text
            }
          }
        }
      }
    }
  }
`;
