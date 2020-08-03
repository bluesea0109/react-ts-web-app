import {GraphPolicy, IGraphPolicyNode } from '@bavard/graph-policy';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, Tooltip } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';
import {Add} from '@material-ui/icons';
import _ from 'lodash';
import React from 'react';
import { Mutation, MutationFunction } from 'react-apollo';
import LineTo from 'react-lineto';
import {IAgentGraphPolicy} from '../../../models/chatbot-service';
import ContentLoading from '../../ContentLoading';
import CreatePolicyForm from './CreatePolicyForm';
import EditNodeForm from './EditNodeForm';
import { updateGraphPolicyMutation } from './gql';
import GraphNode from './GraphNode';

interface IGraphPolicyVisualizerProps {
  policy?: IAgentGraphPolicy;
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
  showDeleteNode: any;
  showEditNode: any;
  loading: boolean;
  showSnackbar: boolean;
  snackbarText: string;
}

const styles = (theme: Theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  graphRow: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  graphCol: {
    display: 'flex',
  },
  intentChip: {
    maxWidth: 150,
    zIndex: 2,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  fullWidth: {
    width: '100%',
  },
});

class GraphPolicyVisualizer extends React.Component<IGraphPolicyVisualizerProps, IGraphPolicyVisualizerState> {
  renderedNodeIds: number[] = [];
  renderedLinePairs: string[] = [];
  constructor(props: IGraphPolicyVisualizerProps) {
    super(props);
    this.state = {
      policy: props.policy,
      graphPolicyInstance: undefined,
      showEditNode: undefined,
      showDeleteNode: undefined,
      loading: false,
      showSnackbar: false,
      snackbarText: '',
    };
  }

  renderTree = (node: IGraphPolicyNode, inIntent?: string) => {
    const {classes} = this.props;
    const policy = this.state.policy;

    const defaultLineProps = {
      delay: true,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#CCCCCC',
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
                const lineProps = defaultLineProps;

                if (e.nodeId < node.nodeId) {
                  lineProps.borderStyle = 'dashed';
                  lineProps.borderColor = '#CCCCCC';
                  lines.push(
                    <LineTo key={`line_${node.nodeId}_${e.nodeId}`} from={`graph_node_${node.nodeId}`}
                    fromAnchor="bottom left"
                    to={`graph_node_${e.nodeId}`} toAnchor="top right"
                    {...lineProps}
                     />,
                  );
                } else {
                  lines.push(
                    <LineTo key={`line_${node.nodeId}_${e.nodeId}`} from={`graph_node_${node.nodeId}`}
                      fromAnchor="bottom"
                      to={`graph_node_${e.nodeId}`} toAnchor="top"
                      {...lineProps}/>,
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

    const isNodeRendered = (this.renderedNodeIds.indexOf(node.nodeId) >= 0);

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

  onDeleteNode = (nodeId: number) => {
    this.closeForms();
    this.setState({showDeleteNode: nodeId});
  }

  onEditNode = (nodeId: number) => {
    this.closeForms();
    this.setState({showEditNode: nodeId});
  }

  closeForms = () => {
    this.setState({
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
          inIntent ?
          <Tooltip title={`Intent: ${inIntent}`}>
            <Chip className={classes.intentChip} label={inIntent}/>
          </Tooltip>
          : <></>
        }
        <GraphNode
          node={node}
          wrapperClassName={`graph_node_${node.nodeId}`}
          onDeleteNode={this.onDeleteNode}
          onEditNode={this.onEditNode}
          />
      </Box>
    );
  }

  renderEditNodeForm = () => {
    const gp = this.getGraphPolicyFromState();
    const node = gp?.getNodeById(this.state.showEditNode);

    if (!node || !gp || !this.state.policy) {
      return <></>;
    }

    return (
      <EditNodeForm agentId={this.state.policy?.agentId} policy={gp}
        nodeId={node.nodeId} onCancel={this.closeForms} onSubmit={this.handleEditNode} />
    );
  }

  handleEditNode = (updatedPolicy: GraphPolicy) => {
    const newPolicy = this.state.policy;
    _.extend(newPolicy, {
      data: updatedPolicy.toJsonObj(),
    });
    this.setState({
      policy: newPolicy,
      showEditNode: null,
    });
  }

  getGraphPolicyFromState = (): GraphPolicy|undefined => {
    const policy = this.state.policy;
    if (!policy) {
      console.error('No policy available');
      return;
    }
    return GraphPolicy.fromJsonObj(policy.data);
  }

  deleteNode = (nodeId: number) => {
    const gp = this.getGraphPolicyFromState();

    gp?.deleteNode(nodeId);

    this.setState({
      policy: _.extend(this.state.policy, {
        data: gp?.toJsonObj(),
      }),
      showDeleteNode: null,
    });
  }

  renderDeleteNodeForm = () => {
    const gp = this.getGraphPolicyFromState();
    const node = gp?.getNodeById(this.state.showDeleteNode);

    if (!node) {
      return <></>;
    }

    return (
      <Dialog open={true} maxWidth={'md'} onBackdropClick={this.closeForms}>
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
          <Button color="primary" onClick={() => this.deleteNode(this.state.showDeleteNode)}>Delete</Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderStartButton() {
    if (!this.state.policy) {
      return <Button variant="contained" color="primary" style={{position: 'fixed', top: 10, left: '48%'}}><Add/></Button>;
    }
    return <></>;
  }

  showSnackbar = (text: string) => {
    this.setState({
      showSnackbar: true,
      snackbarText: text,
    });
  }
  hideSnackbar = () => {
    this.setState({
      showSnackbar: false,
      snackbarText: '',
    });
  }

  persistChanges = async(mutate: MutationFunction) => {
    if (!this.state.policy) {
      return;
    }

    this.setState({loading: true});

    try {
      await mutate({
        variables: {
          id: this.state.policy?.id,
          policy: {
            name: this.state.policy.name,
            data: this.state.policy?.data,
          },
        },
      });
      this.showSnackbar('Changes Saved!');
    } catch (e) {
      this.showSnackbar(e.message);
    }

    this.setState({loading: false});
  }

  handleNewPolicy = (policy: IAgentGraphPolicy) => {
    this.setState({
      policy,
    });
  }

  renderNewPolicy() {
    return (
      <Grid container={true}>
        <Grid item={true} lg={6} sm={12}>
          <CreatePolicyForm onSuccess={this.handleNewPolicy}/>
        </Grid>
      </Grid>
    );
  }

  render() {
    const {classes} = this.props;

    if (!this.state.policy) {
      return this.renderNewPolicy();
    }

    const policy = this.state.policy?.data;

    this.renderedNodeIds = [];
    this.renderedLinePairs = [];
    const treeContent = this.renderTree(policy.rootNode);

    return (
      <div className={classes.root}>
        {treeContent}
        {this.state.showEditNode && this.renderEditNodeForm()}
        {this.state.showDeleteNode && this.renderDeleteNodeForm()}
        <div style={{position: 'fixed', bottom: 5, left: '45%'}}>
          <Mutation mutation={updateGraphPolicyMutation} variables={{id: this.state.policy?.id, policy: this.state.policy}}>
            {(mutateFn: MutationFunction) => (
              <Button variant="contained" color="primary" onClick={() => this.persistChanges(mutateFn)}>Persist Changes</Button>
            )}
          </Mutation>
          {this.state.loading && <ContentLoading/>}
        </div>
        <Snackbar open={this.state.showSnackbar} autoHideDuration={5000} onClose={this.hideSnackbar} message={this.state.snackbarText}/>
      </div>
    );
  }
}

export default withStyles(styles)(GraphPolicyVisualizer);
