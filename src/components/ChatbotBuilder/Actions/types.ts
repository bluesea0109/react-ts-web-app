import { IAgentAction } from '@bavard/agent-config';

export enum ActionsError {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface GetActionsQueryResult {
  ChatbotService_actions: IAgentAction[];
}
