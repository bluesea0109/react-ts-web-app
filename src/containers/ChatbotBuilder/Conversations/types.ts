import { IConversation } from '@bavard/agent-config/dist/dialogue-manager/conversation';

export interface GetLiveConversationsQueryResult {
  ChatbotService_liveConversations: IConversation[];
}
