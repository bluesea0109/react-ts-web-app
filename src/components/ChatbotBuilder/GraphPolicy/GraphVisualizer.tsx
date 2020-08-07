import { MutationFunction } from '@apollo/client';
import { Mutation, Query } from '@apollo/client/react/components';
import {GraphPolicy, IGraphPolicyNode } from '@bavard/graph-policy';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tooltip } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';
import {Add} from '@material-ui/icons';
import _ from 'lodash';
import {withSnackbar, WithSnackbarProps} from 'notistack';
import React from 'react';
import LineTo from 'react-lineto';
import {OptionImagesContext} from '../../../context/OptionImages';
import {IAgentGraphPolicy} from '../../../models/chatbot-service';
import ContentLoading from '../../ContentLoading';
import CreatePolicyForm from './CreatePolicyForm';
import EditNodeForm from './EditNodeForm';
import { getOptionImagesQuery, updateGraphPolicyMutation } from './gql';
import GraphNode from './GraphNode';
import {IGetOptionImagesQueryResult} from './types';

interface IGraphPolicyVisualizerProps extends WithSnackbarProps {
  policy?: IAgentGraphPolicy;
  classes: {
    root: string;
    graphRow: string;
    graphCol: string;
    intentChip: string;
    fullWidth: string;
    nodeBox: string;
    hidden: string;
  };
}

interface IGraphPolicyVisualizerState {
  policy?: IAgentGraphPolicy;
  graphPolicyInstance?: GraphPolicy;
  showDeleteNode: any;
  showEditNode: any;
  loading: boolean;
  snackbarText: string;
  treeRenderCount: number;
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
  nodeBox: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(2),
  },
  hidden: {
    width: 0,
    height: 0,
    opacity: 0
  }
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
      snackbarText: '',
      treeRenderCount: 0
    };
  }

  updateDimensions = () => {
    this.setState({
      treeRenderCount: this.state.treeRenderCount + 1
    })
  }

  componentDidMount(){
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
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
        className={classes.nodeBox}
        >
        {
          inIntent ?
          <Tooltip title={`Intent: ${inIntent}`}>
            <Chip className={classes.intentChip} label={inIntent}/>
          </Tooltip>
          : <></>
        }
        <div className={classes.nodeBox}>
          <GraphNode
            node={node}
            wrapperClassName={`graph_node_${node.nodeId}`}
            onDeleteNode={this.onDeleteNode}
            onEditNode={this.onEditNode}
            />
        </div>
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
      this.props.enqueueSnackbar('Changes Saved!', {variant: 'success'});
    } catch (e) {
      this.props.enqueueSnackbar(e.message, {variant: 'error'});
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
    const content = (
      <div className={classes.root}>
        {treeContent}
        {this.state.showEditNode && this.renderEditNodeForm()}
        {this.state.showDeleteNode && this.renderDeleteNodeForm()}
        <div style={{position: 'fixed', bottom: 5, left: '45%'}}>
          <Mutation mutation={updateGraphPolicyMutation}
            refetchQueries={[{query: getOptionImagesQuery, variables: {agentId: this.state.policy?.agentId}}]}
            variables={{id: this.state.policy?.id, policy: this.state.policy}}>
            {(mutateFn: MutationFunction) => (
              <Button variant="contained" disabled={this.state.loading}
                color="primary" onClick={() => this.persistChanges(mutateFn)}>Persist Changes</Button>
            )}
          </Mutation>
          {this.state.loading && <ContentLoading/>}
        </div>
      </div>
    );

    return (
      <Query<IGetOptionImagesQueryResult> query={getOptionImagesQuery} variables={{agentId: this.state.policy?.agentId}}>
         {({ loading, data }) => {
           if (loading) {
             return <ContentLoading/>;
           }
           return (
             <OptionImagesContext.Provider value={{optionImages: data?.ChatbotService_optionImages || []}}>
               {content}
             </OptionImagesContext.Provider>
          ); }}
        </Query>
    );
  }
}

export default withSnackbar(withStyles(styles)(GraphPolicyVisualizer));
