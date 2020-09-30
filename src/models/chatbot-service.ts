import {
  IAgentAction,
  IAgentConfig,
  IWidgetSettings,
} from '@bavard/agent-config';
import { IGraphPolicy } from '@bavard/agent-config/dist/graph-policy';

export enum ChatbotLanguage {
  EN_US,
  FR,
}

export enum ChatbotActorEnum {
  AGENT,
  USER,
}

export interface IAgent {
  id: number;
  projectId: string;
  uname: string;
  config: IAgentConfig;
  widgetSettings: IWidgetSettings;
}

export interface INLUExampleTag {
  tagType: string;
  start: number;
  end: number;
}

export interface INLUExampleInput {
  text: string;
  intent: string;
  tags: INLUExampleTag[];
}

export interface IIntent {
  id: number;
  agentId: number;
  defaultAction: number;
  value: string;
}

export enum ActionType {
  NEW_ACTION = 'NEW_ACTION',
  UTTERANCE_ACTION = 'UTTERANCE_ACTION',
  EMAIL_ACTION = 'EMAIL_ACTION',
}

export interface ITagType {
  id: number;
  agentId: number;
  value: string;
}

export interface INLUExample {
  id: number;
  agentId: number;
  intent: string;
  text: string;
  tags: INLUExampleTag[];
}

interface IActionBase {
  id: number;
  agentId: number;
  name: string;
  type: ActionType;
  userResponseOptions?: IUserResponseOption[] | null;
}

export interface IUserResponseOption extends IUserResponseOptionInput {
  id: number;
  agentId: number;
  actionId: number;
}

export interface IUserResponseOptionInput {
  intentId: number;
  text: string;
}

export interface IUtteranceAction extends IActionBase {
  text: string;
}

export interface IDataExport {
  id: number;
  agentId: number;
  status: string;
  info?: string;
  kind?: string;
  creator: string;
  createdAt: string;
  url: string;
}

export interface ITrainingJob {
  jobId: string;
  status: string;
}

export interface IAgentModelInfo {
  name: string;
  status: string;
}

export interface IDialogueTurn {
  actor: ChatbotActorEnum;
  action: IAgentAction;
}

export interface IConversation {
  id: number;
  agentId: number;
  turns: IDialogueTurn[];
}

export interface ITrainingConversations {
  agentId: number;
  id: number;
  userActions: ITrainingUserAction[];
  agentActions: ITrainingAgentAction[];
}

export interface ITrainingAgentAction {
  turn: number;
  actionId: number;
  actionName: string;
}

export interface ITrainingUserAction {
  turn: number;
  tagValues: IUserTagValues[];
  intent: string;
  utterance: string;
}

export interface IUserAction {
  intent: string;
  utterance: string;
  tagValues: IUserTagValues[];
  isDefaultResponse?: boolean;
}

export interface IUserTagValues {
  tagType: string;
  value: string;
}

export interface IAgentGraphPolicy {
  id: number;
  agentId: number;
  name: string;
  data: IGraphPolicy;
  isActive: boolean;
}

export interface IOptionImage {
  url: string;
  name: string;
}

export interface IPublishedAgent {
  id: number;
  agentId: number;
  createdAt: string;
  status: string;
  config: IAgentConfig;
  widgetSettings: IWidgetSettings;
}

export interface ISlot {
  id: number;
  agentId: number;
  name: string;
  type: string;
}
