
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
  intentId: number;
  agentId: number;
  intentName?: any;
  text: string;
  tags: any;
}

export enum ActionType {
  UTTERANCE_ACTION = "UTTERANCE_ACTION"
}

export interface IAction {
  id: number;
  agentId: number;
  name: string;
  type: ActionType;
}

export interface IIntent {
  id: number;
  agentId: number;
  defaultAction: number;
  value: string;
}
export interface IUtteranceAction {
  id: number;
  text: string;
}

export interface ITagType {
  id: number;
  agentId: number;
  value: string;
}

export interface IExampleInput {
  text: string;
  intentId: number;
  tags: IExampleTagInput[];
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
  dialogueTurns: IDialogueTurn[];
}

export interface ITrainingConversations {
  agentId: number;
  id: number;
  userActions: IUserAction[];
  agentActions: IAgentAction[];
}

export interface IUserAction {
  turn: number;
  tagValues: IUserTagValues[];
  intent: string;
  utterance: string;
}

export interface IUserTagValues {
  tagType: string;
  value: string;
}

export interface IAgentAction {
  turn: number;
  actionId: number;
  actionType: string;
  utterance: string;
}
