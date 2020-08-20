import { string } from '@bavard/graph-policy/dist/yup';

export type Maybe<T> = T | null | undefined;

export interface IAgentArchiveFiles {
  agentConfig?: string;
  uroImages: File[];
  botIcons: File[];
}
