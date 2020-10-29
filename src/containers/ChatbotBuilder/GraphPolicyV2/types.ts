import { GraphPolicyNode } from '@bavard/agent-config/dist/graph-policy-v2';
import {
  EAgentNodeTypes,
  EUserNodeTypes,
} from '@bavard/agent-config/dist/graph-policy-v2/nodes';

export enum ENodeActor {
  AGENT = 'AGENT',
  USER = 'USER',
}

export interface IGraphEditorNode {
  isNew?: boolean;
  type: EAgentNodeTypes | EUserNodeTypes;
  actor: ENodeActor;
  node?: GraphPolicyNode;
  x?: number;
  y?: number;
}
