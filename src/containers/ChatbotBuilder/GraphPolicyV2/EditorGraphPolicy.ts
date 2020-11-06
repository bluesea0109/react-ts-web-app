import {
  GraphPolicyNode,
  GraphPolicyV2,
} from '@bavard/agent-config/dist/graph-policy-v2';

import { IGraphEditorNode, INodeCoordinates } from './types';

import _ from 'lodash';

export default class EditorGraphPolicy extends GraphPolicyV2 {
  private nodeCoordinates: INodeCoordinates[] = [];
  private draftNodes: IGraphEditorNode[] = [];

  public addDraftNode = (editorNode: IGraphEditorNode) => {
    this.draftNodes.push(editorNode);
  }

  public removeDraftNode = (nodeId: number) => {
    this.draftNodes = _.reject(this.draftNodes, (n) => {
      return n.nodeId === nodeId;
    });
  }

  public getDraftNodes = (): IGraphEditorNode[] => {
    return this.draftNodes;
  }

  public getCoordinatesForNode = (
    nodeId: number,
  ): INodeCoordinates | undefined => {
    const node = _.find(this.nodeCoordinates, { nodeId });
    if (node) {
      return node;
    }
  }

  public setCoordinatesForNode = (
    nodeId: number,
    x: number,
    y: number,
  ): void => {
    const node = _.find(this.nodeCoordinates, { nodeId });
    if (node) {
      node.x = x;
      node.y = y;
      this.nodeCoordinates = _.filter(this.nodeCoordinates, (c) => {
        return c.nodeId !== nodeId;
      });
    }

    this.nodeCoordinates.push({
      nodeId,
      x,
      y,
    });
  }
}
