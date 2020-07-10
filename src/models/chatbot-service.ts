
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

export interface IIntent {
  id: number;
  agentId: number;
  defaultResponse: string;
  value: string;
}
export interface IUtteranceAction {
  id: number;
  agentId: number;
  name: string;
  text: string;
}

export interface ITagType {
  id: number;
  agentId: number;
  value: string;
}

export interface IExampleInput {
  text: string;
  intent: string;
  tags: IExampleTagInput[];
}

export interface IExampleTagInput {
  tagType: string;
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
