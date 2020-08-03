import { IAgentGraphPolicy } from '../../../models/chatbot-service';

export interface IGetGraphPoliciesQueryResult {
  ChatbotService_graphPolicies: IAgentGraphPolicy[];
}

export interface IDeleteGraphPolicyMutationResult {
  ChatbotService_deleteGraphPolicy: IAgentGraphPolicy;
}

export interface ICreateGraphPolicyMutationResult {
  ChatbotService_createGraphPolicy: IAgentGraphPolicy;
}

export interface IUpdateGraphPolicyMutationResult {
  ChatbotService_updateGraphPolicy: IAgentGraphPolicy;
}

export interface IActivateGraphPolicyMutationResult {
  ChatbotService_updateActivePolicy: string;
}

export interface IGetImageUploadSignedUrlQueryResult {
  ChatbotService_imageOptionUploadUrl: {
    url: string,
  };
}
