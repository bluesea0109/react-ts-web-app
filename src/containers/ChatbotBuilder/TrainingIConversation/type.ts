import { IUserUtteranceAction } from '@bavard/agent-config/dist/actions/user';
import { IAgentUtteranceAction } from '@bavard/agent-config';

export enum ACTION_TYPE {
  USER_ACTION = 'user_action',
  AGENT_ACTION = 'agent_action',
}

export enum FIELD_TYPE {
  INTENT = 'Intent',
  TAG = 'Tag Type',
  NAME = 'name',
}

export type IUtternaceAction = IUserUtteranceAction | IAgentUtteranceAction;

export type Field = {
  name: string;
  value: string;
};
