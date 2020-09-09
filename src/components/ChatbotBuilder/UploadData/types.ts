import { AgentSettings, BotSettings } from '@bavard/common';
import {
  ActionType,
  IAgent,
  IAgentGraphPolicy,
  IEmailAction,
  ISlot,
} from '../../../models/chatbot-service';
import { IOptionType } from '../Options/types';
export interface IAgentAction {
  type: ActionType;
  name: string;
  text: string;
  userResponseOptions: IUserResponseAction[];
}

export interface IUserResponseAction {
  intent: string;
  action: string;
}

export interface IAgentDialogueConfig {
  projectId: string;
  agentId: number;
  uname: string;
  intents: IAgentDataIntent[];
  tagTypes: string[];
  slots: ISlot[];
  utteranceActions: IAgentAction[];
  emailActions: IEmailAction[];
  userResponseOptions: IUserResponseOptionExport[];
  graphPolicies: IAgentGraphPolicy[];
}
export interface INLUExample {
  intent?: string;
  text: string;
  tags: ITag[];
}

interface ITag {
  tagType: string;
  start: number;
  end: number;
}

export interface INLUTrainingData {
  intents: string[];
  tagTypes: string[];
  examples: INLUExample[];
}

export interface IAgentDataExport {
  dialogueConfig: IAgentDialogueConfig;
  trainingConversations: ITrainingConversation[];
  nluData: INLUTrainingData;
  widgetConfig: BotSettings;
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

export interface IUserResponseOptionExport {
  intent: string;
  text: string;
  image_url?: string;
  type: IOptionType;
}

export interface IAgentDataIntent {
  intent: string;
  defaultAction?: number | null;
}

export interface IAgentDataIntentGqlVars {
  value: string;
  defaultAction?: number | null;
}
