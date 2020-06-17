
export enum ChatbotLanguage {
  EN_US,
  FR,
}

export interface IAgent {
  id: number;
  projectId: string;
  name: string;
  language: string;
}

export interface IIntent {
  id: number;
  agentId: number;
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
