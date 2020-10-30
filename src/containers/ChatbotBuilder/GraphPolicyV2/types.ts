import { IGraphPolicyNode } from '@bavard/agent-config/dist/graph-policy-v2';
import {
  EAgentNodeTypes,
  EUserNodeTypes,
} from '@bavard/agent-config/dist/graph-policy-v2/nodes';

import { IOptionImage } from '../../../models/chatbot-service';

export enum ENodeActor {
  AGENT = 'AGENT',
  USER = 'USER',
}

export interface IGraphEditorNode {
  isNew?: boolean;
  type: EAgentNodeTypes | EUserNodeTypes;
  actor: ENodeActor;
  node?: IGraphPolicyNode;
  itemId?: number;
  x?: number;
  y?: number;
}

export interface IGetOptionImagesQueryResult {
  ChatbotService_optionImages: IOptionImage[];
}

export interface IGetImageUploadSignedUrlQueryResult {
  ChatbotService_imageOptionUploadUrl: {
    url: string;
  };
}
