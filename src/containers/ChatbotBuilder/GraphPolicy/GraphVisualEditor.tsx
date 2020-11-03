import { MutationFunction } from '@apollo/client';
import { Mutation, Query } from '@apollo/client/react/components';
import {
  AgentConfig,
  EmailNode,
  GraphPolicy,
  GraphPolicyNode,
  UtteranceNode,
} from '@bavard/agent-config';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
} from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';
import { Add, Remove } from '@material-ui/icons';
import _ from 'lodash';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import LineTo from 'react-lineto';
import { OptionImagesContext } from '../../../context/OptionImages';

import {
  CHATBOT_UPDATE_AGENT,
  GET_OPTION_IMAGES_QUERY,
} from '../../../common-gql-queries';
import { IGetOptionImagesQueryResult } from '../../../models/common-service';
import ContentLoading from '../../ContentLoading';
import CreatePolicyForm from './CreatePolicyForm';
import EditNodeForm from './EditNodeForm';
import GraphNode from './GraphNode';

interface IGraphPolicyVisualEditorProps extends WithSnackbarProps {
  agentId: number;
  policyName?: string;
  agentConfig: AgentConfig;
  classes: {
    root: string;
    graphRow: string;
    graphCol: string;
    intentChip: string;
    fullWidth: string;
    nodeBox: string;
    hidden: string;
    zoomControls: string;
  };
}

interface IGraphPolicyVisualEditorState {
  agentId: number;
  policyName?: string;
  policy?: GraphPolicy;
  agentConfig: AgentConfig;
  graphPolicyInstance?: GraphPolicy;
  showDeleteNode: any;
  showEditNode: any;
  loading: boolean;
  snackbarText: string;
  treeRenderCount: number;
  zoom: number;
}

const styles = (theme: Theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
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
    opacity: 0,
  },
  zoomControls: {
    zIndex: 100,
    top: 50,
    width: 30,
    right: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
});

class GraphPolicyVisualEditor extends React.Component<
  IGraphPolicyVisualEditorProps,
  IGraphPolicyVisualEditorState
> {
  renderedNodeIds: number[] = [];
  renderedLinePairs: string[] = [];
  mutateFunction: MutationFunction | undefined = undefined;
  constructor(props: IGraphPolicyVisualEditorProps) {
    super(props);
    this.state = {
      agentId: props.agentId,
      policyName: props.policyName,
      policy: props.policyName
        ? props.agentConfig.getGraphPolicy(props.policyName)
        : undefined,
      agentConfig: props.agentConfig,
      graphPolicyInstance: undefined,
      showEditNode: undefined,
      showDeleteNode: undefined,
      loading: false,
      snackbarText: '',
      treeRenderCount: 0,
      zoom: 100,
    };
  }

  updateDimensions = () => {
    this.setState({
      treeRenderCount: this.state.treeRenderCount + 1,
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  zoom(direction: 'in' | 'out') {
    let zoom = this.state.zoom;
    if (direction === 'in') {
      zoom += 10;
    }
    if (direction === 'out') {
      zoom -= 10;
    }
    this.setState({ zoom });
  }

  renderTree = (
    gpNode: GraphPolicyNode | UtteranceNode | EmailNode | undefined,
    inIntent?: string,
  ) => {
    const { classes } = this.props;
    const gp = this.state.policy;
    const policyJson = gp?.toJsonObj();

    const node = gpNode?.toJsonObj();

    if (!gp || !policyJson || !node) {
      return <></>;
    }

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
          {node.outEdges?.map((e) => {
            const edgeNode = gp.getNodeById(e.nodeId);
            const nodeData = edgeNode?.toJsonObj();
            // Handle Recursions and infinite loops
            if (
              nodeData &&
              this.renderedLinePairs.indexOf(`${node.nodeId}_${e.nodeId}`) ===
                -1
            ) {
              const lineProps = defaultLineProps;

              if (e.nodeId < node.nodeId) {
                lineProps.borderStyle = 'dashed';
                lineProps.borderColor = '#CCCCCC';
                lines.push(
                  <LineTo
                    key={`line_${node.nodeId}_${e.nodeId}`}
                    from={`graph_node_${node.nodeId}`}
                    fromAnchor="bottom left"
                    to={`graph_node_${e.nodeId}`}
                    toAnchor="top right"
                    {...lineProps}
                  />,
                );
              } else {
                lines.push(
                  <LineTo
                    key={`line_${node.nodeId}_${e.nodeId}`}
                    from={`graph_node_${node.nodeId}`}
                    fromAnchor="bottom"
                    to={`graph_node_${e.nodeId}`}
                    toAnchor="top"
                    {...lineProps}
                  />,
                );
              }

              this.renderedLinePairs.push(`${node.nodeId}_${e.nodeId}`);

              return (
                <div key={`node_${node.nodeId}_edge_${e.nodeId}`}>
                  {this.renderTree(edgeNode, e.option?.intent)}
                </div>
              );
            } else {
              return <></>;
            }
          })}
        </div>,
      );
    }

    const isNodeRendered = this.renderedNodeIds.indexOf(node.nodeId) >= 0;

    const content = (
      <div>
        <div className={classes.graphRow}>
          {!isNodeRendered && gpNode ? (
            this.renderEditableNode(gpNode, inIntent)
          ) : (
            <></>
          )}
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
    this.setState({ showDeleteNode: nodeId });
  }

  onEditNode = (nodeId: number) => {
    this.closeForms();
    this.setState({ showEditNode: nodeId });
  }

  closeForms = () => {
    this.setState({
      showEditNode: null,
      showDeleteNode: null,
    });
  }

  renderEditableNode = (
    node: GraphPolicyNode | UtteranceNode | EmailNode,
    inIntent?: string,
  ) => {
    const { classes } = this.props;
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        key={node.nodeId}
        className={classes.nodeBox}>
        {inIntent ? (
          <Tooltip title={`Intent: ${inIntent}`}>
            <Chip className={classes.intentChip} label={inIntent} />
          </Tooltip>
        ) : (
          <></>
        )}
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
    const gp = this.state.policy;
    const node = gp?.getNodeById(this.state.showEditNode);

    if (!node || !gp) {
      return <></>;
    }

    return (
      <EditNodeForm
        agentId={this.state.agentId}
        policy={gp}
        nodeId={node.nodeId}
        onCancel={this.closeForms}
        onSubmit={this.handleEditNode}
        onUpdate={this.persistChanges}
      />
    );
  }

  handleEditNode = (updatedPolicy: GraphPolicy) => {
    const newPolicy = this.state.policy;
    _.extend(newPolicy, {
      data: updatedPolicy.toJsonObj(),
    });
    this.setState(
      {
        policy: newPolicy,
        showEditNode: null,
      },
      () => {
        this.persistChanges(updatedPolicy);
      },
    );
  }

  deleteNode = (nodeId: number) => {
    const gp = this.state.policy;

    gp?.deleteNode(nodeId);

    this.setState({
      policy: _.extend(this.state.policy, {
        data: gp?.toJsonObj(),
      }),
      showDeleteNode: null,
    });
  }

  renderDeleteNodeForm = () => {
    const gp = this.state.policy;
    const node = gp?.getNodeById(this.state.showDeleteNode);

    if (!node) {
      return <></>;
    }

    return (
      <Dialog open={true} maxWidth={'md'} onBackdropClick={this.closeForms}>
        <DialogTitle>Are you sure you want to delete this node?</DialogTitle>
        <DialogContent>
          This will remove this node from the policy, and will delete all edges
          to this node
          <GraphNode node={node} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeForms}>Cancel</Button>
          <Button
            color="primary"
            onClick={() => this.deleteNode(this.state.showDeleteNode)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderStartButton() {
    if (!this.state.policy) {
      return (
        <Button
          variant="contained"
          color="primary"
          style={{ position: 'fixed', top: 10, left: '48%' }}>
          <Add />
        </Button>
      );
    }
    return <></>;
  }

  persistChanges = async (policy: GraphPolicy) => {
    this.setState({
      policy,
    });
    if (!policy) {
      return;
    }

    const mutate = this.mutateFunction;
    if (!mutate) {
      // This should ideally never trigger, because the UX renders within the Mutation Component
      return this.props.enqueueSnackbar('Mutation Not Ready');
    }

    this.setState({ loading: true });

    try {
      const policyData = policy.toJsonObj();
      if (policyData.intents.length === 0) {
        policyData.intents.push('default');
      }

      const updatedPolicy = GraphPolicy.fromJsonObj(policyData);

      const updatedConfig = this.state.agentConfig;
      updatedConfig.addGraphPolicy(updatedPolicy);

      this.setState({
        agentConfig: updatedConfig,
      });

      await mutate({
        variables: {
          agentId: this.state.agentId,
          config: updatedConfig.toJsonObj(),
        },
      });
      this.props.enqueueSnackbar('Changes Saved!', { variant: 'success' });
    } catch (e) {
      this.props.enqueueSnackbar(e.message, { variant: 'error' });
    }

    this.setState({ loading: false });
  }

  handleNewPolicy = (policy: GraphPolicy) => {
    this.setState({
      policy,
    });
  }

  renderNewPolicy() {
    return (
      <Grid container={true}>
        <Grid
          item={true}
          lg={6}
          sm={12}
          style={{ position: 'relative', margin: 'auto', top: '200px' }}>
          <CreatePolicyForm onSuccess={this.handleNewPolicy} />
        </Grid>
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;

    const gp = this.state.policy;
    const policyJson = gp?.toJsonObj();

    const { agentId } = this.state;

    if (!policyJson || !gp) {
      return this.renderNewPolicy();
    }

    this.renderedNodeIds = [];
    this.renderedLinePairs = [];
    const treeContent = this.renderTree(gp.rootNode);
    const content = (
      <React.Fragment>
        <Paper className={classes.zoomControls} style={{ position: 'fixed' }}>
          <Tooltip title={`Zoom: ${this.state.zoom}%`}>
            <div>
              <IconButton
                color="default"
                size="small"
                onClick={() => this.zoom('in')}>
                <Add />
              </IconButton>
              <Divider />
              <IconButton
                color="default"
                size="small"
                onClick={() => this.zoom('out')}>
                <Remove />
              </IconButton>
            </div>
          </Tooltip>
        </Paper>

        <div className={classes.root} style={{ zoom: `${this.state.zoom}%` }}>
          <div style={{ position: 'absolute', top: 0, left: 0 }}>
            {treeContent}
          </div>
          {this.state.showEditNode && this.renderEditNodeForm()}
          {this.state.showDeleteNode && this.renderDeleteNodeForm()}
        </div>
        <div style={{ position: 'fixed', bottom: 5, left: '45%' }}>
          <Mutation
            mutation={CHATBOT_UPDATE_AGENT}
            refetchQueries={[
              {
                query: GET_OPTION_IMAGES_QUERY,
                variables: { agentId },
              },
            ]}>
            {(mutateFn: MutationFunction) => {
              this.mutateFunction = mutateFn;
              return (
                <Button
                  variant="contained"
                  disabled={this.state.loading}
                  color="primary"
                  onClick={() =>
                    this.state.policy && this.persistChanges(this.state.policy)
                  }>
                  Save Changes
                </Button>
              );
            }}
          </Mutation>
          {this.state.loading && <ContentLoading shrinked={true}/>}
        </div>
      </React.Fragment>
    );

    return (
      <Query<IGetOptionImagesQueryResult>
        query={GET_OPTION_IMAGES_QUERY}
        variables={{ agentId }}>
        {({ loading, data }) => {
          if (loading) {
            return <ContentLoading/>;
          }
          return (
            <OptionImagesContext.Provider
              value={{ optionImages: data?.ChatbotService_optionImages || [] }}>
              {content}
            </OptionImagesContext.Provider>
          );
        }}
      </Query>
    );
  }
}

export default withSnackbar(withStyles(styles)(GraphPolicyVisualEditor));
