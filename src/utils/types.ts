export type Maybe<T> = T | null | undefined;

export interface IAgentArchiveFiles {
  agentConfig?: string;
  uroImages: File[];
  botIcons: File[];
}

export enum EKeyboardCmd {
  COPY = 'COPY',
  PASTE = 'PASTE',
  UNDO = 'UNDO',
  REDO = 'REDO',
  DELETE = 'DELETE',
  MOVERIGHT = 'MOVERIGHT',
  MOVELEFT = 'MOVELEFT',
  MOVEUP = 'MOVEUP',
  MOVEDOWN = 'MOVEDOWN',
  SAVE = 'SAVE',
}
