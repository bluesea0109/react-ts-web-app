import { AgentConfig, WidgetSettings } from '@bavard/agent-config';
import { atom } from 'recoil';

export const currentAgentConfig = atom<AgentConfig | undefined>({
  key: 'currentConfig', // unique ID (with respect to other atoms/selectors)
  default: undefined,
  dangerouslyAllowMutability: true,
});
export const currentWidgetSettings = atom<WidgetSettings | undefined>({
  key: 'currentWidgetSettings', // unique ID (with respect to other atoms/selectors)
  default: undefined,
  dangerouslyAllowMutability: true,
});
