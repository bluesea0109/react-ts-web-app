import { IAgentGraphPolicy, IOptionImage } from '../../../models/chatbot-service';

export interface IGetGraphPoliciesQueryResult {
  ChatbotService_graphPolicies: IAgentGraphPolicy[];
}
