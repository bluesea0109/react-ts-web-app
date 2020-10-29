import { AddCircle } from '@material-ui/icons';
import {
  FlowChart,
  FlowChartWithState,
  ICanvasOuterDefaultProps,
  INodeDefaultProps,
  IPortDefaultProps,
} from '@mrblenny/react-flow-chart';
import React from 'react';
import GraphEditorNode from './GraphEditorNode';
import { chartSimple } from './sample';

const PortCustom = (props: IPortDefaultProps) => <AddCircle />;

const CanvasOuterCustom = (props: ICanvasOuterDefaultProps) => (

  <div
    style={{
      position: 'relative',
      backgroundColor: '#4f6791',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      cursor: 'not-allowed',
    }}/>
);

const NodeCustom = React.forwardRef(
  (
    { node, children, ...otherProps }: INodeDefaultProps,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <div ref={ref} {...otherProps}>
        {/* <GraphNode nodeType="agent">{children}</GraphNode> */}
      </div>
    );
  },
);

const GraphEditor = () => {
  return (
    <FlowChartWithState
      config={{
        showArrowHead: true,
      }}
      initialValue={chartSimple}
      Components={{}}
    />
  );
};

export default GraphEditor;
