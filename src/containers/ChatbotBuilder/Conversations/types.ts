import { IConversation } from '@bavard/agent-config/dist/conversations';

export interface GetLiveConversationsQueryResult {
  ChatbotService_liveConversations: IConversation[];
}
