import { IConversation } from '../../../models/chatbot-service';

export interface GetLiveConversationsQueryResult {
  ChatbotService_liveConversations: IConversation[];
}
