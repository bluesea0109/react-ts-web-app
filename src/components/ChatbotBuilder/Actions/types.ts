import { AnyAction } from '../../../models/chatbot-service';

export enum ActionsError {
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

export interface GetActionsQueryResult {
  ChatbotService_actions: AnyAction[];
}
