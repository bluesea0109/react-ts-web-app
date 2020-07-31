import { Box, Chip, Tooltip, Fab, DialogActions, Button, Dialog, DialogContent, DialogTitle, Grid } from '@material-ui/core';
import {Add, Delete, Edit, CloseRounded} from '@material-ui/icons';
import { Theme, withStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import _ from 'lodash';
import React from 'react';
import LineTo, {SteppedLineTo} from 'react-lineto';
import {IAgentGraphPolicy} from '../../../models/graph-policy';
import {IGraphPolicyNode, GraphPolicy, GraphPolicyNode, UtteranceNode} from '@bavard/graph-policy';
import EditNodeForm from './EditNodeForm';
import GraphNode from './GraphNode';

interface IGraphPolicyVisualizerProps {
  policy: IAgentGraphPolicy;
  classes: {
    root: string;
    graphRow: string;
    graphCol: string;
    intentChip: string;
    fullWidth: string;
  };
}

interface IGraphPolicyVisualizerState {
  policy?: IAgentGraphPolicy;
  graphPolicyInstance?: GraphPolicy;
  hoveredNodeId?: number;
  showAddNode: any;
  showAddEdge: any;
  showDeleteNode: any;
  showEditNode: any;
}

const styles = (theme: Theme) => ({
  root: {
    width: '100%',
    display: 'flex',
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
    maxWidth: 150,
    zIndex: 2,
  },
  fullWidth: {
    width: "100%"
  }
});

class GraphPolicyVisualizer extends React.Component<IGraphPolicyVisualizerProps, IGraphPolicyVisualizerState> {
  renderedNodeIds:number[] = [];
  renderedLinePairs:string[] = [];
  constructor(props: IGraphPolicyVisualizerProps) {
    super(props);
    this.state = {
      policy: props.policy,
      graphPolicyInstance: undefined,
      hoveredNodeId: undefined,
      showAddEdge: undefined,
      showAddNode: undefined,
      showEditNode: undefined,
      showDeleteNode: undefined,
    };
  }

  renderTree = (node: IGraphPolicyNode, inIntent?: string) => {
    const {classes} = this.props;
    const policy = this.state.policy;

    const defaultLineProps = {
      delay: true,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#666666',
      within: classes.root,
    };

    const edges = [];
    const lines: any[] = [];
    
    if (node.outEdges?.length >= 1) {
      edges.push(
        <div className={classes.graphRow} key={`node_${node.nodeId}`}>
          {
            node.outEdges?.map((e) => {
              const nodeData = _.find(policy?.data.nodes, { nodeId: e.nodeId });
              // Handle Recursions and infinite loops
              if (nodeData && this.renderedLinePairs.indexOf(`${node.nodeId}_${e.nodeId}`) === -1) {
                let lineProps = defaultLineProps;
                
                if(e.nodeId < node.nodeId) {
                  lineProps.borderStyle = "dashed";
                  lineProps.borderColor = "#CCCCCC";
                  lines.push(
                    <LineTo key={`line_${node.nodeId}_${e.nodeId}`} from={`graph_node_${node.nodeId}`}
                    fromAnchor="bottom left"
                    to={`graph_node_${e.nodeId}`} toAnchor="top right"
                    {...lineProps}
                     />
                  )
                }
                else {
                  lines.push(
                    <SteppedLineTo key={`line_${node.nodeId}_${e.nodeId}`} from={`graph_node_${node.nodeId}`}
                      fromAnchor="bottom"
                      to={`graph_node_${e.nodeId}`} toAnchor="top"
                      {...lineProps}/>
                  );
                }

                
                this.renderedLinePairs.push(`${node.nodeId}_${e.nodeId}`);
                return (
                  <div key={`node_${node.nodeId}_edge_${e.nodeId}`}>
                    {this.renderTree(nodeData, e.option?.intent )}
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

    let isNodeRendered = (this.renderedNodeIds.indexOf(node.nodeId) >= 0);
    
    const content = (
      <div>
        <div className={classes.graphRow}>
          {
            !isNodeRendered ?
            this.renderEditableNode(node, inIntent)
            :
            <></>
          }
        </div>
        {edges}
        {lines}
      </div>
    );

    this.renderedNodeIds.push(node.nodeId);
    return content;
  }

  onAddEdge =(nodeId: number)=> {
    this.closeForms();
    console.log("ADDING EDGE", nodeId);
    this.setState({showAddEdge: nodeId});
  }

  onDeleteNode =(nodeId: number)=> {
    this.closeForms();
    console.log("DELETING NODE", nodeId);
    this.setState({showDeleteNode: nodeId});
  }

  onEditNode =(nodeId: number)=> {
    this.closeForms();
    console.log("EDITING NODE", nodeId);
  }

  closeForms=()=> {
    this.setState({
      showAddEdge: null,
      showAddNode: null,
      showEditNode: null,
      showDeleteNode: null,
    });
  }

  renderEditableNode = (node: IGraphPolicyNode, inIntent?: string) => {
    const {classes} = this.props;
    return (
      <Box display="flex" flexDirection="column" 
        justifyContent="center" alignItems="center"
        key={node.nodeId}
        >
        {
          inIntent?
          <Tooltip title={`Intent: ${inIntent}`}>
            <Chip className={classes.intentChip} label={inIntent}/>
          </Tooltip>
          : <></>
        }
        <GraphNode 
          node={node} 
          wrapperClassName={`graph_node_${node.nodeId}`}
          onAddEdge={this.onAddEdge}
          onDeleteNode={this.onDeleteNode}
          onEditNode={this.onEditNode}
          />
      </Box>
    )
  }

  renderAddEdgeForm = () => {
    let gp = this.getGraphPolicyFromState();
    let node = gp?.getNodeById(this.state.showAddEdge);

    if(!node || !gp) {
      return <></>;
    }

    return (
      <EditNodeForm policy={gp} nodeId={node.nodeId} onCancel={this.closeForms} onSubmit={()=>{}} />
    )
  }

  getRootNode = () => {

  }

  getGraphPolicyFromState = ():GraphPolicy|undefined => {
    let policy = this.state.policy;
    if(!policy) {
      console.error("No policy available");
      return;
    }
    return GraphPolicy.fromJsonObj(policy.data);
  }

  deleteNode = (nodeId: number) => {
    let gp = this.getGraphPolicyFromState();
    console.log("DELETING NODE: ", nodeId);

    gp?.deleteNode(nodeId);

    this.setState({
      policy: _.extend(this.state.policy, {
        data: gp?.toJsonObj()
      }),
      showDeleteNode: null
    })
  }
  

  renderDeleteNodeForm = () => {
    let gp = this.getGraphPolicyFromState();
    let node = gp?.getNodeById(this.state.showDeleteNode);

    if(!node) {
      return <></>;
    }

    return (
      <Dialog open={true} maxWidth={"md"} onBackdropClick={this.closeForms}>
        <DialogTitle>
          Are you sure you want to delete this node?
        </DialogTitle>
        <DialogContent>
          This will remove this node from the policy, and will delete all edges to this node
          <GraphNode 
            node={node.toJsonObj()} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeForms}>Cancel</Button>
          <Button color="primary" onClick={()=>this.deleteNode(this.state.showDeleteNode)}>Delete</Button>
        </DialogActions>
      </Dialog>
    )
  }

  renderStartButton() {
    if(!this.state.policy) {
      return <Fab color="primary"><Add/></Fab>
    }
    return <></>;
  }



  render() {
    const {classes} = this.props;

    const policy = this.state.policy?.data;
    if (!policy?.rootNode) {
      return <></>;
    }

    this.renderedNodeIds = [];
    this.renderedLinePairs = [];
    const treeContent = this.renderTree(policy.rootNode);
    

    return (
      <div className={classes.root}>
        {this.renderStartButton()}
        {treeContent}
        {this.state.showAddEdge && this.renderAddEdgeForm()}
        {this.state.showDeleteNode && this.renderDeleteNodeForm()}
      </div>
    );
  }
}

export default withStyles(styles)(GraphPolicyVisualizer);
