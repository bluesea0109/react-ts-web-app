import {
  GraphPolicyNode,
  IGraphPolicyNode,
  GraphPolicyV2,
  UserNode,
} from '@bavard/agent-config/dist/graph-policy-v2';
import { EAgentNodeTypes } from '@bavard/agent-config/dist/graph-policy-v2/nodes';
import { ENodeActor } from './types';
import _uniq from 'lodash/uniq';

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
  node: GraphPolicyNode | IGraphPolicyNode
): ENodeActor => {
  if (node.nodeType in EAgentNodeTypes) {
    return ENodeActor.AGENT;
  } else {
    return ENodeActor.USER;
  }
};

export const getArrowCoords = (
  startNode: GraphPolicyNode,
  endNode: GraphPolicyNode,
  nodeHeight: number,
  nodeWidth: number
) => {
  let x1 = startNode.position.x;
  let y1 = startNode.position.y;
  let x2 = endNode.position.x;
  let y2 = endNode.position.y;

  const dx = x2 - x1;
  const dy = y2 - y1;

  // Child is directly below parent
  if (dy >= nodeHeight && dx >= -nodeWidth && dx <= nodeWidth) {
    x1 = x1 + nodeWidth / 2;
    y1 = y1 + nodeHeight;
    x2 = x2 + nodeWidth / 2;
  }

  // Child is to the bottom right of parent
  if (dx >= nodeWidth && dy >= nodeHeight) {
    x1 = startNode.position.x + nodeWidth;
    y1 = startNode.position.y + nodeHeight;
  }

  // Child is to the right of parent
  if (dx >= nodeWidth && dy <= nodeHeight && dy >= -nodeHeight) {
    x1 = startNode.position.x + nodeWidth;
    y1 = startNode.position.y + nodeHeight / 2;
    y2 = endNode.position.y + nodeHeight / 2;
  }

  // Child is to the top right of parent
  if (dx >= nodeWidth && dy <= -nodeHeight) {
    x1 = startNode.position.x + nodeWidth;
    y2 = endNode.position.y + nodeHeight;
  }

  // Child is directly above parent
  if (dy <= -nodeHeight && dx >= -nodeWidth && dx <= nodeWidth) {
    x1 = startNode.position.x + nodeWidth / 2;
    x2 = endNode.position.x + nodeWidth / 2;
    y2 = endNode.position.y + nodeHeight;
  }

  // Child is to the top left of parent
  if (dx <= -nodeWidth && dy <= -nodeHeight) {
    x2 = endNode.position.x + nodeWidth;
    y2 = endNode.position.y + nodeHeight;
  }

  // Child is to the left of parent
  if (dx <= -nodeWidth && dy <= nodeHeight && dy >= -nodeHeight) {
    y1 = startNode.position.y + nodeHeight / 2;
    x2 = endNode.position.x + nodeWidth;
    y2 = endNode.position.y + nodeHeight / 2;
  }

  // Child is to the bottom left of parent
  if (dx <= -nodeWidth && dy >= nodeHeight) {
    y1 = startNode.position.y + nodeHeight;
    x2 = endNode.position.x + nodeWidth;
  }

  return {
    x1,
    y1,
    x2,
    y2,
  };
};

export const getAllIntents = (gp: GraphPolicyV2): string[] => {
  const intents: string[] = [];
  gp.getAllNodes().forEach((n) => {
    const nodeActor = getNodeActor(n);
    if (nodeActor === 'USER') {
      n = n as UserNode;
      const intent = n.toJsonObj().intent;
      if (intent) {
        intents.push(intent);
      }
    }
  });
  return _uniq(intents);
};
