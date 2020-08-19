import { IGraphPolicy } from '@bavard/graph-policy';

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
  name: string;
  language: string;
}

export interface IExample {
  id: number;
  intentId: number | null;
  agentId: number;
  intentName?: any;
  text: string;
  tags: any[];
}

export interface IExampleInput {
  intentId: number | null;
  text: string;
  tags: IExampleTagInput[];
}

export enum ActionType {
  NEW_ACTION = 'NEW_ACTION',
  UTTERANCE_ACTION = 'UTTERANCE_ACTION',
}

export interface IIntent {
  id: number;
  agentId: number;
  defaultAction: number;
  value: string;
}

export interface ITagType {
  id: number;
  agentId: number;
  value: string;
}

export interface IExampleTagInput {
  tagTypeId: number;
  start: number;
  end: number;
}

export interface IDataExport {
  id: number;
  agentId: number;
  status: string;
  info?: string;
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
  utterance: string;
  utteranceActionId?: number;
  customActionId?: number;
}

export interface IConversation {
  id: number;
  agentId: number;
  turns: (IUserAction | IAgentAction)[];
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

export interface IAgentAction {
  action: IUtteranceAction;
}

interface IActionBase {
  id: number;
  agentId: number;
  name: string;
  type: ActionType;
  userResponseOptions?: IUserResponseOption[] | null;
}

export interface IUtteranceAction extends IActionBase {
  text: string;
}

export type AnyAction = IUtteranceAction;

export interface IUserResponseOption extends IUserResponseOptionInput {
  id: number;
  agentId: number;
  actionId: number;
}

export interface IUserResponseOptionInput {
  intentId: number;
  text: string;
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
