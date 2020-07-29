import { IGraphPolicy } from '../../../models/chatbot-service';

export interface IGetGraphPoliciesQueryResult {
  ChatbotService_graphPolicies: IGraphPolicy[];
}

export interface IDeleteGraphPolicyMutationResult {
  ChatbotService_deleteGraphPolicy: IGraphPolicy;
}

export interface IActivateGraphPolicyMutationResult {
  ChatbotService_updateActivePolicy: string;
}
