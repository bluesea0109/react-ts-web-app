import { IAgentConfig } from '@bavard/agent-config';
import { OptionType } from '@bavard/agent-config';
import { BotSettings } from '@bavard/common';
import {
  IAgent,
  IAgentGraphPolicy,
  INLUExample,
} from '../../../models/chatbot-service';

export interface INLUTrainingData {
  intents: string[];
  tagTypes: string[];
  examples: INLUExample[];
}

export interface IAgentDataExport {
  config: IAgentConfig;
  trainingConversations: ITrainingConversation[];
  nluData: INLUTrainingData;
  widgetSettings: BotSettings;
  apiKey?: string;
}

export interface ITagValue {
  tagType: string;
  value: string;
}
export interface ITrainingConversation {
  agentActions: {
    turn: number;
    actionName: string;
  }[];
  userActions: {
    turn: number;
    intent: string;
    tagValues: ITagValue[];
    utterance: string;
  }[];
}
export interface ITrainingConversationMutationInput
  extends ITrainingConversation {
  agentId: number;
}

export interface IGetAgentQueryResult {
  ChatbotService_agent: IAgent;
}

export interface ICreateAgentMutationResult {
  ChatbotService_createAgent: IAgent;
}

export interface IUpdateAgentMutationResult {
  ChatbotService_UpdateAgent: IAgent;
}
