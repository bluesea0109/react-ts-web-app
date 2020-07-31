// TODO - Expoert these from the npm module instead
import {IGraphPolicy} from '@bavard/graph-policy';
export interface IResponseOption {
  intent: string;
  type: OptionType;
}
export interface ITextOption extends IResponseOption {
  text: string;
}
export interface IImageOption extends IResponseOption {
  imageName: string;
}

export interface ITagValue {
  tagType: string;
  value: string;
}
export interface IUserAction {
  intent: string;
  tags: ITagValue[];
}
export interface IAgentAction {
  actionName: string;
  utterance: string;
  options: IResponseOption[];
}
// export interface IGraphPolicy {
//   version: string;
//   rootNode: IGraphPolicyNode;
//   currentNode: IGraphPolicyNode | null;
//   nodes: IGraphPolicyNode[];
// }
export declare type IGraphPolicyNode = IUtteranceNode;
export interface IUtteranceNode {
  nodeId: number;
  nodeType: string;
  actionName: string;
  utterance: string;
  options: IResponseOption[];
  outEdges: IOutEdge[];
}
export interface IOutEdge {
  intent?: string;
  nodeId: number;
}
export declare enum OptionType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}

export interface IAgentGraphPolicy {
  id: number;
  agentId: number;
  name: string;
  data: IGraphPolicy;
  isActive: boolean;
}
