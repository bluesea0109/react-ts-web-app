// TODO - Expoert these from the npm module instead
import {IGraphPolicy} from '@bavard/graph-policy';

export interface IAgentGraphPolicy {
  id: number;
  agentId: number;
  name: string;
  data: IGraphPolicy;
  isActive: boolean;
}
