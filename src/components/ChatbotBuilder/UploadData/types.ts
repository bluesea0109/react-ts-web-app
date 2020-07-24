import { ActionType } from '../../../models/chatbot-service';

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

export interface IAgentData {
  utteranceActions: IAgentAction[];
  intents: IAgentDataIntent[];
  tagTypes: string[];
  examples: IAgentDataExample[];
}

export interface IAgentDataIntent {
  intent: string;
  defaultAction?: number | null;
}

export interface IAgentDataIntentGqlVars {
  value: string;
  defaultAction?: number | null;
}

export interface IAgentDataExample {
  text: string;
  intent: string;
  tags: IAgentDataExampleTag[];
}

export interface IAgentDataExampleTag {
  tagType: string;
  start: number;
  end: number;
}
