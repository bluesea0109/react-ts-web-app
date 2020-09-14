import { AgentConfig } from '@bavard/agent-config';
import {
  atom,
} from 'recoil';

export const currentAgentConfig = atom<AgentConfig | undefined>({
  key: 'currentConfig', // unique ID (with respect to other atoms/selectors)
  default: undefined,
  dangerouslyAllowMutability: true,
});
