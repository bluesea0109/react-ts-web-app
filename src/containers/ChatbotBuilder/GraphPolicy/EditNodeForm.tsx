import {
  EmailNode,
  FormNode,
  GraphPolicy,
  GraphPolicyNode,
  IHyperlinkOption,
  UtteranceNode,
} from '@bavard/agent-config';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Add,
  ArrowDropDown,
  ArrowDropUp,
  Delete,
  Edit,
} from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import EdgeChip from './EdgeChip';
import GraphNode from './GraphNode';
import NodeOptionChip from './NodeOptionChip';
import UpsertEdge from './UpsertEdge';
import UpsertNodeForm from './UpsertNodeForm';
import UpsertNodeOptionForm from './UpsertNodeOptionForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fullWidth: {
      width: '100%',
    },
    optionChip: {
      margin: 2,
    },
    nodePaper: {
      backgroundColor: theme.palette.background.default,
      borderRadius: theme.spacing(1),
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    formControl: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    edgeActions: {
      opacity: 0,
      width: 300,
      display: 'flex',
      justifyContent: 'flex-end',
      '&:hover': {
        opacity: 1,
      },
    },
  }),
);

interface IGraphNodeProps {
  policy: GraphPolicy;
  nodeId: number;
  agentId: number;
  onCancel: () => void;
  onUpdate?: (policy: GraphPolicy) => void;
  onSubmit: (policy: GraphPolicy) => void;
}

export default function EditNodeForm({
  nodeId,
  agentId,
  policy,
  onCancel,
  onSubmit,
  onUpdate,
}: IGraphNodeProps) {
  const classes = useStyles();
  const [graphPolicy, setPolicy] = useState<GraphPolicy>(policy);
  const node = graphPolicy.getNodeById(nodeId);
  const [updatedNodeData, setUpdatedNodeData] = useState<
    GraphPolicyNode | UtteranceNode | EmailNode | FormNode | undefined
  >(node);
  const [upsertingEdge, setUpsertingEdge] = useState(false);
  const [upsertingNodeOption, setUpsertingNodeOption] = useState(false);
  const [editingOptionId, setEditingOptionId] = useState<number | undefined>();
  const [editingEdgeId, setEditingEdgeId] = useState<number | undefined>();
  const [numChanges, setNumStateChanges] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setUpsertingEdge(false);
  }, [editingEdgeId]);

  const activateForm = (name: 'edge' | 'nodeOption' | null, index?: number) => {
    let edge = false;
    let option = false;
    setUpsertingEdge(edge);
    setUpsertingNodeOption(option);

    if (name === 'edge') {
      edge = true;
    } else if (name === 'nodeOption') {
      option = true;
      setEditingOptionId(index);
    }
    setTimeout(() => {
      setUpsertingEdge(edge);
      setUpsertingNodeOption(option);
    }, 200);
  };

  const removeEdge = (edgeId: number) => {
    node?.removeEdge(edgeId);
    setPolicy(graphPolicy);
    onUpdate?.(graphPolicy);
    setNumStateChanges(numChanges + 1);
  };

  const removeOptionAtIndex = (index: number) => {
    node?.removeOptionAtIndex(index);
    setNumStateChanges(numChanges + 1);
  };

  const getOptionByIndex = (index?: number) => {
    if (index === undefined) {
      return;
    }
    return node?.options[index];
  };

  if (!node) {
    return <></>;
  }

  const incEdgePosition = (edgeId: number) => {
    const newPos = node.getEdgePosition(edgeId) + 1;
    if (newPos >= 0) {
      node.setEdgePosition(edgeId, newPos);
    }

    setNumStateChanges(numChanges + 1);
  };

  const decEdgePosition = (edgeId: number) => {
    const newPos = node.getEdgePosition(edgeId) - 1;
    if (newPos >= 0) {
      node.setEdgePosition(edgeId, newPos);
    }

    setNumStateChanges(numChanges + 1);
  };

  const handleAddEdge = (updPolicy: GraphPolicy) => {
    setNumStateChanges(numChanges + 1);
    activateForm(null);
    setPolicy(updPolicy);
    onUpdate?.(updPolicy);
    setNumStateChanges(numChanges + 1);
  };

  const handleUpsertNodeOption = (updPolicy: GraphPolicy) => {
    setNumStateChanges(numChanges + 1);
    activateForm(null);
    setPolicy(updPolicy);
    onUpdate?.(updPolicy);
    setNumStateChanges(numChanges + 1);
  };

  const validateAndSubmit = () => {
    if (!node) {
      return;
    }

    if (
      !updatedNodeData?.actionName ||
      (updatedNodeData.type !== 'FormNode' && !updatedNodeData?.toJsonObj().utterance)
    ) {
      return enqueueSnackbar('Node data is invalid');
    }

    node.setActionName(updatedNodeData.actionName);
    node.setUtterance(updatedNodeData.toJsonObj().utterance);

    if (node instanceof EmailNode && updatedNodeData instanceof EmailNode) {
      node.setFromEmail(updatedNodeData.from);
      node.setToEmail(updatedNodeData.to);
    } else if (node instanceof FormNode && updatedNodeData instanceof FormNode) {      
      const { url, fields } = updatedNodeData;
      node.url = url;
      node.fields = fields;
    }

    onSubmit(graphPolicy);
  };

  return (
    <Dialog
      open={true}
      maxWidth={'lg'}
      onBackdropClick={onCancel}
      fullWidth={true}>
      <DialogTitle>Edit Node</DialogTitle>
      <DialogContent>
        <Grid container={true} className={classes.fullWidth} spacing={2}>
          <Grid item={true} lg={3} md={12}>
            <Paper className={classes.nodePaper}>
              <UpsertNodeForm
                nodeId={node.nodeId}
                node={node}
                onChange={setUpdatedNodeData}
              />
            </Paper>

            <GraphNode node={node} />
          </Grid>
          <Grid item={true} lg={4} md={12}>
            <Paper className={classes.nodePaper}>
              <Typography variant={'h6'}>
                Edges
                <Tooltip
                  title={
                    node.hasAnEmptyEdge()
                      ? 'Cannot add anymore edges because this node has an empty edge'
                      : 'Add an Edge'
                  }>
                  <IconButton
                    disabled={node.hasAnEmptyEdge()}
                    onClick={() => {
                      setEditingEdgeId(undefined);
                      activateForm('edge');
                    }}>
                    <Add />
                  </IconButton>
                </Tooltip>
              </Typography>

              {node.toJsonObj().outEdges.map((e, index) => {
                return (
                  <EdgeChip
                    node={node}
                    key={`${node.nodeId}_${index}`}
                    edgeId={e.nodeId}
                    actions={
                      <div className={classes.edgeActions}>
                        {index !== 0 && (
                          <Tooltip placement="top" title="Move up">
                            <IconButton
                              size="small"
                              onClick={() => {
                                decEdgePosition(e.nodeId);
                              }}>
                              <ArrowDropUp />
                            </IconButton>
                          </Tooltip>
                        )}
                        {index < node?.edges.length - 1 && (
                          <Tooltip placement="top" title="Move down">
                            <IconButton
                              size="small"
                              onClick={() => {
                                incEdgePosition(e.nodeId);
                              }}>
                              <ArrowDropDown />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip placement="top" title="Edit Edge">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingEdgeId(e.nodeId);
                              activateForm('edge');
                            }}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip placement="top" title="Delete Edge">
                          <IconButton
                            size="small"
                            onClick={() => {
                              removeEdge(e.nodeId);
                            }}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </div>
                    }
                  />
                );
              })}
            </Paper>

            <Paper className={classes.nodePaper}>
              <Typography variant={'h6'}>
                Options
                <IconButton
                  onClick={() => {
                    setEditingEdgeId(undefined);
                    activateForm('nodeOption');
                  }}>
                  <Add />
                </IconButton>
              </Typography>

              {node.options.map((o, index) => {
                if (o.type === 'HYPERLINK') {
                  const opt = o as IHyperlinkOption;
                  return (
                    <NodeOptionChip
                      option={opt}
                      key={index}
                      actions={
                        <div className={classes.edgeActions}>
                          <Tooltip placement="top" title="Edit Option">
                            <IconButton
                              size="small"
                              onClick={() => {
                                activateForm('nodeOption', index);
                              }}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip placement="top" title="Delete Option">
                            <IconButton
                              size="small"
                              onClick={() => {
                                removeOptionAtIndex(index);
                              }}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </div>
                      }
                    />
                  );
                }
                return <div key={index} />;
              })}
            </Paper>
          </Grid>
          <Grid item={true} lg={5} md={12}>
            {upsertingEdge ? (
              <UpsertEdge
                agentId={agentId}
                edgeId={editingEdgeId}
                nodeId={node.nodeId}
                policy={graphPolicy}
                onSuccess={handleAddEdge}
                onCancel={onCancel}
              />
            ) : upsertingNodeOption ? (
              <UpsertNodeOptionForm
                nodeId={node.nodeId}
                optionIndex={editingOptionId}
                option={getOptionByIndex(editingOptionId)}
                policy={graphPolicy}
                onSuccess={handleUpsertNodeOption}
              />
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={validateAndSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
