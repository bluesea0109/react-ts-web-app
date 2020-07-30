import { IAgentGraphPolicy } from '../../../models/graph-policy';

export interface IGetGraphPoliciesQueryResult {
  ChatbotService_graphPolicies: IAgentGraphPolicy[];
}

export interface IDeleteGraphPolicyMutationResult {
  ChatbotService_deleteGraphPolicy: IAgentGraphPolicy;
}

export interface IActivateGraphPolicyMutationResult {
  ChatbotService_updateActivePolicy: string;
}
