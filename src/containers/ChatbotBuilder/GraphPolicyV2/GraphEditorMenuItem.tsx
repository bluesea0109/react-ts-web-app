import { INode, REACT_FLOW_CHART } from '@mrblenny/react-flow-chart';
import React from 'react';
import GraphEditorNode from './GraphEditorNode';

export interface IGraphNodeMenuItemProps {
  type: string;
  nodeType: 'agent' | 'user';
  ports: INode['ports'];
  properties?: any;
}

const GraphNodeMenuItem = ({
  nodeType,
  type,
  ports,
  properties,
}: IGraphNodeMenuItemProps) => {
  // return <GraphEditorNode nodeType={nodeType} draggable={true} />;
  return <></>;
};
export default GraphNodeMenuItem;
