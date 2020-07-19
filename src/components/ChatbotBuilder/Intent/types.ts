import { IIntent } from '../../../models/chatbot-service';

export interface GetIntentsQueryResult {
  ChatbotService_intents: IIntent[];
}
