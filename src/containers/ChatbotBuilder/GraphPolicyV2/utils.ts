import {
  GraphPolicyNode,
  IGraphPolicyNode,
} from '@bavard/agent-config/dist/graph-policy-v2';
import { EAgentNodeTypes } from '@bavard/agent-config/dist/graph-policy-v2/nodes';
import { ENodeActor } from './types';

export const snapItemPosition = (x: number, y: number) => {
  let snappedX = Math.ceil((x + 1) / 10) * 10;
  let snappedY = Math.ceil((y + 1) / 10) * 10;

  if (snappedX < 10) {
    snappedX = 10;
  }
  if (snappedY < 10) {
    snappedY = 10;
  }

  return {
    x: snappedX,
    y: snappedY,
  };
};

export const getNodeActor = (
  node: GraphPolicyNode | IGraphPolicyNode,
): ENodeActor => {
  if (node.nodeType in EAgentNodeTypes) {
    return ENodeActor.AGENT;
  } else {
    return ENodeActor.USER;
  }
};
