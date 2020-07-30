import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import { Theme, withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import React from 'react';
import {SteppedLineTo} from 'react-lineto';
import {IAgentGraphPolicy, IGraphPolicyNode} from '../../../models/graph-policy';
import GraphNode from './GraphNode';

interface IGraphPolicyVisualizerProps {
  policy: IAgentGraphPolicy;
  classes: {
    root: string;
    graphRow: string;
    graphCol: string;
    intentChip: string;
  };
}

interface IGraphPolicyVisualizerState {
  policy: IAgentGraphPolicy;
}

const styles = (theme: Theme) => ({
  root: {
    width: '100%',
  },
  graphRow: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    paddingBottom: theme.spacing(3),
  },
  graphCol: {
    display: 'flex',
  },
  intentChip: {
    width: 100,
    zIndex: 2,
  },
});

class GraphPolicyVisualizer extends React.Component<IGraphPolicyVisualizerProps, IGraphPolicyVisualizerState> {
  constructor(props: IGraphPolicyVisualizerProps) {
    super(props);
    this.state = {
      policy: props.policy,
    };
  }

  renderNodes = (node: IGraphPolicyNode, inIntent?: string) => {
    const {classes} = this.props;
    const policy = this.state.policy;

    const lineProps = {
      delay: true,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#999999',
      // zIndex: 999999,
      within: classes.root,
    };

    const edges = [];
    const lines: any[] = [];
    if (node.outEdges?.length >= 1) {
      edges.push(
        <div className={classes.graphRow} key={`node_${node.nodeId}`}>
          {
            node.outEdges?.map((e) => {
              const nodeData = _.find(policy.data.nodes, { nodeId: e.nodeId });
              if (nodeData) {
                lines.push(
                  <SteppedLineTo key={`line_${node.nodeId}_${e.nodeId}`} from={`graph_node_${node.nodeId}`}
                    fromAnchor="bottom"
                    to={`graph_node_${e.nodeId}`} toAnchor="top"
                    {...lineProps}
                     />,
                );
                return (
                  <div key={`node_${node.nodeId}_edge_${e.nodeId}`}>
                    {this.renderNodes(nodeData, e.intent )}
                  </div>
                );
              } else {
                return <></>;
              }
            })
          }
        </div>,
      );
    }

    const content = (
      <div>
        <div className={classes.graphRow}>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            {
              inIntent
              ?
              <Chip color="primary" className={classes.intentChip} label={inIntent}/>
              : <></>
            }
            <GraphNode node={node} wrapperClassName={`graph_node_${node.nodeId}`}/>
          </Box>
        </div>
        {edges}
        {lines}
      </div>
    );

    return content;
  }

  render() {
    const {classes} = this.props;

    const policy = this.state.policy?.data;
    if (!policy?.rootNode) {
      return <></>;
    }

    const nodesRender = this.renderNodes(policy.rootNode);

    return (
      <div className={classes.root}>
        {nodesRender}
      </div>
    );
  }
}

export default withStyles(styles)(GraphPolicyVisualizer);
