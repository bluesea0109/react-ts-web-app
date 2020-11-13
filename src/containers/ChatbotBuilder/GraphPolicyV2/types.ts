import {
  GraphPolicyNode,
  IGraphPolicyV2,
} from '@bavard/agent-config/dist/graph-policy-v2';
import {
  EAgentNodeTypes,
  EUserNodeTypes,
} from '@bavard/agent-config/dist/graph-policy-v2/nodes';

import { IOptionImage } from '../../../models/chatbot-service';

export enum ENodeActor {
  AGENT = 'AGENT',
  USER = 'USER',
}

export interface IGraphEditorDraftNode {
  actor: ENodeActor;
  type: EAgentNodeTypes | EUserNodeTypes;
  isNew?: boolean;
}

export interface IGraphEditorNode extends IGraphEditorDraftNode {
  node?: GraphPolicyNode;
  nodeId: number;
  x: number;
  y: number;
}

export interface IGetOptionImagesQueryResult {
  ChatbotService_optionImages: IOptionImage[];
}

export interface IGetImageUploadSignedUrlQueryResult {
  ChatbotService_imageOptionUploadUrl: {
    url: string;
  };
}

export interface IItemPosition {
  x: number;
  y: number;
}

export interface INodeCoordinates {
  nodeId: number;
  x: number;
  y: number;
}

export interface IGpHistory {
  history: IGraphPolicyV2[];
  currentIndex: number;
}
