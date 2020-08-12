import { ActionType, IAgentGraphPolicy } from '../../../models/chatbot-service';
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

export interface IAgentData {
  utteranceActions: IAgentAction[];
  intents: IAgentDataIntent[];
  tagTypes: string[];
  examples: IAgentDataExample[];
  graphPolicies: IAgentGraphPolicy[];
  userResponseOptions: IUserResponseOptionExport[];
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
