import gql from 'graphql-tag';

export const getLiveConversationsQuery = gql`
  query($agentId: Int!) {
    ChatbotService_liveConversations(agentId: $agentId) {
      id
      agentId
      turns {
        ... on ChatbotService_AgentTurn {
          actor
          agentAction {
            nodeId
            type
            name
            options {
              type
              ... on ChatbotService_TextOption {
                intent
                text
              }
              ... on ChatbotService_ImageOption {
                intent
                imageUrl
                caption
                text
              }
              ... on ChatbotService_HyperlinkOption {
                text
                targetLink
              }
            }
            ... on ChatbotService_UtteranceAction {
              utterance
            }
            ... on ChatbotService_EmailAction {
              prompt
            }
          }
        }
        ... on ChatbotService_UserTurn {
          actor
          userAction {
            utterance
            intent
            tagValues {
              tagType
              value
            }
          }
        }
        ... on ChatbotService_HumanAgentTurn {
          actor
          timestamp
          humanAgentId
          humanAgentAction {
            utterance
          }
        }
      }
    }
  }
`;
