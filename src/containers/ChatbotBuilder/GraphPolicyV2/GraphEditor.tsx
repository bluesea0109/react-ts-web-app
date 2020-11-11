import { GraphPolicyV2 } from '@bavard/agent-config/dist/graph-policy-v2';

import {
  AgentNode,
  GraphPolicyNode,
  UserNode,
} from '@bavard/agent-config/dist/graph-policy-v2';

import { Button, IconButton, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Add, Delete, Remove } from '@material-ui/icons';
import clsx from 'clsx';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useEffect, useRef, useState } from 'react';
import { EKeyboardCmd } from '../../../utils/types';
import { getAction } from '../../../utils/windowEvents';
import EdgeArrow from './EdgeArrow';
import GraphEditorNode from './GraphEditorNode';
import { IGraphEditorNode, IItemPosition } from './types';
import UpsertNodeDialog from './UpsertNodeDialog';

import {
  getAllIntents,
  getArrowCoords,
  getNodeActor,
  getZoomedCoord,
  snapItemPosition,
} from './utils';

const GRID_SIZE = 10;
const NODE_WIDTH = 23 * GRID_SIZE;
const NODE_HEIGHT = 12 * GRID_SIZE;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      height: '100%',
    },
    canvasContainer: {
      display: 'flex',
      overflow: 'auto',
      padding: theme.spacing(2),
      position: 'relative',
    },
    editorCanvas: {
      position: 'relative',
      display: 'flex',
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      backgroundSize: `10px 10px`,
      backgroundImage: `linear-gradient(to right, ${theme.palette.grey[200]} 1px, transparent 1px),
      linear-gradient(to bottom, ${theme.palette.grey[200]} 1px, transparent 1px)`,
    },
    node: {
      zIndex: 2,
    },
    item: {
      position: 'absolute',
    },
    textArea: {
      width: '100%',
    },
    deleteZone: {
      width: 100,
      height: 100,
      background: theme.palette.grey[100],
      padding: 20,
      textAlign: 'center',
      position: 'fixed',
      bottom: 30,
      right: 30,
      borderRadius: '50%',
      zIndex: 1,
      color: theme.palette.error.main,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteZoneHovered: {
      background: theme.palette.grey[300],
      border: `dashed 1px ${theme.palette.error.main}`,
    },
    floatingIconButton: {
      position: 'absolute',
    },
    deleteEdgeButton: {
      color: theme.palette.error.main,
      position: 'absolute',
    },
    canvasControls: {
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 10,
    },
    controlButton: {
      minWidth: 30,
      width: 30,
      height: 30,
      padding: 2,
      background: theme.palette.background.default,
      display: 'block',
      marginBottom: theme.spacing(1),
    },
  }),
);

interface IProps {
  agentId: number;
  policy: GraphPolicyV2;
}

interface INodePair {
  start: GraphPolicyNode;
  end: GraphPolicyNode;
}

const GraphEditor = ({ agentId, policy }: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [gp, setGp] = useState<GraphPolicyV2>(policy);
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingArrowRef = useRef<SVGPolylineElement>(null);
  const [changes, setChanges] = useState(0);
  const [editingNodeId, setEditingNodeId] = useState<number>();
  const [selectedNodeId, selectNode] = useState<number>();
  const [copiedNodeId, copyNode] = useState<number>();
  const [draggingNodeId, setDraggingNodeId] = useState<number>();
  const [draggingOverDelete, setDraggingOverDelete] = useState(false);
  const [editingNode, setEditingNode] = useState<IGraphEditorNode>();
  const [draftNodes, setDraftNodes] = useState<IGraphEditorNode[]>([]);
  const [showingEdgeActions, setShowEdgeActions] = useState<INodePair>();

  const [drawingArrowStart, setDrawingArrowStart] = useState<IItemPosition>();
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 500,
    height: 500,
  });

  // Transform node data to render easily
  const nodeToGraphEditorNode = (node: GraphPolicyNode) => {
    return {
      node,
      nodeId: node.nodeId,
      type: node.nodeType,
      actor: getNodeActor(node),
      isNew: false,
      x: node.position.x,
      y: node.position.y,
    };
  };

  // When the editing nodeId changes, set the editingnode value to the node Id.
  // This value is used in the edit node form
  useEffect(() => {
    if (editingNodeId) {
      const node = gp.getNodeById(editingNodeId);
      if (node) {
        setEditingNode(nodeToGraphEditorNode(node));
      }
      const draftNode = _.find(draftNodes, { nodeId: editingNodeId });
      if (draftNode) {
        setEditingNode(draftNode);
      }
    } else {
      setEditingNode(undefined);
    }
  }, [editingNodeId, draftNodes, gp]);

  // Increase the canvas size to always be larger than the bounds of the graph
  useEffect(() => {
    let maxX = 500;
    let maxY = 500;

    gp.getAllNodes().forEach((n) => {
      if (n.position.x >= maxX) {
        maxX = n.position.x;
      }
      if (n.position.y >= maxY) {
        maxY = n.position.y;
      }
    });

    setCanvasDimensions({
      width: maxX + 500,
      height: maxY + 500,
    });
  }, [changes, gp.zoom, gp]);

  // Handle ctrl+c, ctrl+v, ctrl+z, ctrl+y
  const handleKeyboardCmd = (event: KeyboardEvent) => {
    const cmd = getAction(event);
    if (!cmd) {
      return;
    }

    event.stopPropagation();

    switch (cmd) {
      case EKeyboardCmd.COPY: {
        if (selectedNodeId) {
          copyNode(selectedNodeId);
        }
        break;
      }

      case EKeyboardCmd.PASTE: {
        if (copiedNodeId) {
          const newNode = gp.cloneNode(
            copiedNodeId,
            gp.newNodeId() + draftNodes.length,
          );

          if (newNode) {
            newNode.setPosition({
              x: newNode.position.x + NODE_WIDTH + GRID_SIZE,
              y: newNode.position.y + NODE_HEIGHT + GRID_SIZE,
            });

            gp.upsertNode(newNode);

            setGp(gp);
            selectNode(undefined);
          }
        }
        break;
      }

      case EKeyboardCmd.DELETE: {
        if (selectedNodeId) {
          gp.deleteNodeById(selectedNodeId);
          gp.sortAllChildNodes();
          deleteDraftNode(selectedNodeId);
          enqueueSnackbar('Node Deleted', { variant: 'success' });
        }
        break;
      }
    }

    if (
      cmd === EKeyboardCmd.MOVEDOWN ||
      cmd === EKeyboardCmd.MOVEUP ||
      cmd === EKeyboardCmd.MOVELEFT ||
      cmd === EKeyboardCmd.MOVERIGHT
    ) {
      if (selectedNodeId) {
        const node = gp.getNodeById(selectedNodeId);
        if (node) {
          let x = node?.position.x || 0;
          let y = node?.position.y || 0;

          switch (cmd) {
            case EKeyboardCmd.MOVEDOWN: {
              y += GRID_SIZE;
              break;
            }
            case EKeyboardCmd.MOVEUP: {
              y -= GRID_SIZE;
              break;
            }
            case EKeyboardCmd.MOVERIGHT: {
              x += GRID_SIZE;
              break;
            }
            case EKeyboardCmd.MOVELEFT: {
              x -= GRID_SIZE;
              break;
            }
          }

          if (x < GRID_SIZE) {
            x = GRID_SIZE;
          }

          if (y < GRID_SIZE) {
            y = GRID_SIZE;
          }

          node?.setPosition({
            x,
            y,
          });

          setGp(gp);
          setChanges(changes + 1);
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardCmd, true);

    return () => {
      document.removeEventListener('keydown', handleKeyboardCmd, true);
    };
  }, [selectedNodeId, copiedNodeId, changes]);

  const gpNodes = gp.getAllNodes();

  const editorNodes: IGraphEditorNode[] = [];
  gpNodes.forEach((node) => {
    editorNodes.push(nodeToGraphEditorNode(node));
  });

  const addDraftNode = (draftNode: IGraphEditorNode) => {
    let nodeId = gp.newNodeId() + draftNodes.length + 1;
    if (draftNode.nodeId) {
      nodeId = draftNode.nodeId;
    }
    draftNode.nodeId = nodeId;

    const newDraftNodes = _.reject(draftNodes, (n) => {
      return nodeId === n.nodeId;
    });

    newDraftNodes.push(draftNode);

    setDraftNodes(newDraftNodes);
    setChanges(changes + 1);
  };

  // Either create a new node if required, or change the position if the node exists
  const handleNodeDrop = (event: React.DragEvent<HTMLDivElement>) => {
    setDraggingNodeId(undefined);
    clearDrawingArrow();

    const data: IGraphEditorNode = JSON.parse(
      event.dataTransfer.getData('NODE_DATA') || '{}',
    );

    if (_.isEmpty(data)) {
      return;
    }

    // Get relative position to canvas
    const rect = event.currentTarget.getBoundingClientRect();

    const pos = snapItemPosition(
      getZoomedCoord(event.clientX, rect.x, gp.zoom) - NODE_WIDTH + 10,
      getZoomedCoord(event.clientY, rect.y, gp.zoom) - 10,
    );

    data.x = pos.x;
    data.y = pos.y;

    // Handle new node or draft node
    if (data.isNew || !data.node) {
      data.isNew = false;
      addDraftNode(data);
    }

    // Handle existing gp node
    const node = gp.getNodeById(data.node?.nodeId || 0);
    if (node && node) {
      node.setPosition({
        x: data.x,
        y: data.y,
      });
      gp.sortAllChildNodes();
      setGp(gp);
    }

    // Trigger render
    setChanges(changes + 1);
  };

  const deleteDraftNode = (nodeId: number) => {
    const newDraftNodes = _.reject(draftNodes, (n) => {
      return n.nodeId === nodeId;
    });
    setDraftNodes(newDraftNodes);
  };

  // Update the node data once the edit node form is submitted
  const handleNodeUpdate = (node: GraphPolicyNode) => {
    // handle existing node
    const existingNode = gp.getNodeById(node.nodeId);
    if (existingNode) {
      node.position = existingNode.position;
    }

    // handle existing draft node
    const existingDraft = _.find(draftNodes, { nodeId: node.nodeId });
    if (existingDraft) {
      node.position = {
        x: existingDraft.x,
        y: existingDraft.y,
      };
    }

    // Delete old and add new
    deleteDraftNode(node.nodeId);

    gp.upsertNode(node);

    setGp(gp);
    setEditingNodeId(undefined);
  };

  const handleNodeDragStart = (nodeId: number) => {
    setDraggingNodeId(nodeId);
  };

  // Delete the dropped item
  const handleDeleteZoneDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const data: IGraphEditorNode = JSON.parse(
      event.dataTransfer.getData('NODE_DATA') || '{}',
    );
    setDraggingNodeId(undefined);
    setDraggingOverDelete(false);

    if (_.isEmpty(data)) {
      return;
    }

    gp.deleteNodeById(data.nodeId);
    gp.sortAllChildNodes();
    deleteDraftNode(data.nodeId);
    enqueueSnackbar('Node Deleted', { variant: 'success' });
  };

  const handleDeleteZoneDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDraggingOverDelete(true);
  };

  const showEdgeActions = (
    shouldShow: boolean,
    startNode: GraphPolicyNode,
    endNode: GraphPolicyNode,
  ) => {
    if (!shouldShow) {
      setShowEdgeActions(undefined);
      return;
    }

    setShowEdgeActions({
      start: startNode,
      end: endNode,
    });
  };

  // Draw arrows for all the edges
  const renderArrows = () => {
    const arrows: React.ReactNode[] = [];
    const nodes = gp.getAllNodes();
    nodes.forEach((node, index) => {
      if (node.childAgentNode) {
        const caNode = node.childAgentNode;
        const coords = getArrowCoords(node, caNode, NODE_HEIGHT, NODE_WIDTH);

        arrows.push(
          <EdgeArrow
            key={`arrow_${node.nodeId}_${caNode.nodeId}`}
            startElementId={node.nodeId}
            endElementId={caNode.nodeId}
            startNodeId={node.nodeId}
            endNodeId={caNode.nodeId}
            onLineClick={(event) => showEdgeActions(true, node, caNode)}
            x1={coords.x1}
            y1={coords.y1}
            x2={coords.x2}
            y2={coords.y2}
          />,
        );
      }
      if (getNodeActor(node) === 'AGENT') {
        node = node as AgentNode;

        node.childUserNodes.forEach((cuNode) => {
          const coords = getArrowCoords(node, cuNode, NODE_HEIGHT, NODE_WIDTH);
          arrows.push(
            <EdgeArrow
              key={`arrow_${node.nodeId}_${cuNode.nodeId}`}
              startElementId={node.nodeId}
              endElementId={cuNode.nodeId}
              startNodeId={node.nodeId}
              endNodeId={cuNode.nodeId}
              onLineClick={(event) => showEdgeActions(true, node, cuNode)}
              x1={coords.x1}
              y1={coords.y1}
              x2={coords.x2}
              y2={coords.y2}
            />,
          );
        });
      }
    });

    return arrows;
  };

  const handleDeleteEdge = (start: GraphPolicyNode, end: GraphPolicyNode) => {
    const sActor = getNodeActor(start);

    if (sActor === 'AGENT') {
      start = start as AgentNode;
      start.removeChild(end);
    }
    if (sActor === 'USER') {
      start = start as UserNode;
      start.removeChildAgentNode();
    }

    gp.sortAllChildNodes();
    setGp(gp);
    enqueueSnackbar('Edge deleted', { variant: 'success' });
    setShowEdgeActions(undefined);
  };

  // Show the actions in the midpoint of the edge arrow
  const renderEdgeActions = () => {
    if (!showingEdgeActions) {
      return <></>;
    }

    const { start, end } = showingEdgeActions;

    const coords = getArrowCoords(start, end, NODE_HEIGHT, NODE_WIDTH);

    const x = (coords.x1 + coords.x2) / 2;
    const y = (coords.y1 + coords.y2) / 2;

    return (
      <Tooltip title="Delete this edge">
        <IconButton
          size="small"
          className={classes.deleteEdgeButton}
          onClick={() => handleDeleteEdge(start, end)}
          style={{
            top: y,
            left: x,
          }}>
          <Delete />
        </IconButton>
      </Tooltip>
    );
  };

  const doZoom = (direction: 'in' | 'out') => {
    if (!gp.zoom) {
      gp.zoom = 100;
    }
    if (direction === 'in' && gp.zoom <= 490) {
      gp.zoom += 10;
    }

    if (direction === 'out' && gp.zoom >= 10) {
      gp.zoom -= 10;
    }
    setGp(gp);
    setChanges(changes + 1);
  };

  // Start drawing an edge arrow when you drag out from a terminal
  const handleTerminalDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeData: IGraphEditorNode,
  ) => {
    const rect = canvasRef.current?.getBoundingClientRect();

    const rectX = rect?.x || 0;
    const rectY = rect?.y || 0;

    const start = {
      x: getZoomedCoord(event.clientX, rectX, gp.zoom),
      y: getZoomedCoord(event.clientY, rectY, gp.zoom),
    };

    setDrawingArrowStart(start);

    event.dataTransfer.setData(
      'DRAGGING_OUT_TERMINAL',
      JSON.stringify(nodeData || '{}'),
    );
  };

  // If an edge arrow is dropped on a node, add the edge
  const handleEdgeDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetNode: IGraphEditorNode,
  ) => {
    clearDrawingArrow();
    const sourceNode: IGraphEditorNode = JSON.parse(
      event.dataTransfer.getData('DRAGGING_OUT_TERMINAL') || '{}',
    );

    if (sourceNode.node && targetNode.node) {
      let gpSource = gp.getNodeById(sourceNode.nodeId);
      let gpTarget = gp.getNodeById(targetNode.nodeId);

      if (gpSource && gpTarget) {
        const sActor = getNodeActor(gpSource);
        const tActor = getNodeActor(gpTarget);

        if (sActor === 'AGENT') {
          gpSource = gpSource as AgentNode;

          // Only one child agent node is allowed
          if (tActor === 'AGENT') {
            if (gpSource.childAgentNode) {
              return enqueueSnackbar('Only one child agent node is allowed', {
                variant: 'error',
              });
            }
          }

          try {
            // Add the child node - either agent or user node
            gpSource.addChild(gpTarget);
          } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error' });
          }
        }

        if (sActor === 'USER') {
          gpSource = gpSource as UserNode;

          if (tActor === 'AGENT') {
            if (gpSource.childAgentNode) {
              return enqueueSnackbar('Only one child agent node is allowed', {
                variant: 'error',
              });
            }

            // Add the single agent child node
            gpTarget = gpTarget as AgentNode;
            gpSource.setChildAgentNode(gpTarget);
          } else {
            return enqueueSnackbar('A user node cannot have child user nodes', {
              variant: 'error',
            });
          }
        }

        setGp(gp);
        setChanges(changes + 1);
      }
    }
  };

  const clearDrawingArrow = () => {
    setDrawingArrowStart(undefined);
    const drawingArrow = drawingArrowRef.current;
    drawingArrow?.setAttribute('points', ``);
  };

  // When you click and drag a terminal, keep updating the edge arrow drawn from that terminal
  const handleArrowDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const rect = canvasRef.current?.getBoundingClientRect();
    const rectX = rect?.x || 0;
    const rectY = rect?.y || 0;

    const arrowEnd = {
      x: (event.clientX * 100) / gp.zoom - rectX,
      y: (event.clientY * 100) / gp.zoom - rectY,
    };

    const drawingArrow = drawingArrowRef.current;

    if (drawingArrowStart) {
      drawingArrow?.setAttribute(
        'points',
        `${drawingArrowStart?.x},${drawingArrowStart?.y}  ${arrowEnd.x},${arrowEnd.y}`,
      );
    }
  };

  const drawingArrow = (
    <React.Fragment>
      <defs>
        <marker
          id={`drawing_arrow_head`}
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth={10}
          markerHeight={10}
          orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={'#808080'} />
        </marker>
      </defs>

      <polyline
        ref={drawingArrowRef}
        points={``}
        fill="none"
        stroke={'#808080'}
        strokeWidth={1}
        markerEnd={`url(#drawing_arrow_head)`}
      />
    </React.Fragment>
  );

  // Select the node. Important - Stop propagation to underlying elements
  const handleNodeClick = (event: React.MouseEvent<any>, nodeId: number) => {
    event.stopPropagation();
    selectNode(nodeId);
  };

  return (
    <div className={classes.root} ref={containerRef}>
      <div
        className={classes.canvasControls}
        style={{ top: (containerRef.current?.offsetTop || 0) + 40 }}>
        <Tooltip title={`Zoom: ${gp.zoom}%`}>
          <div>
            <Button
              variant="outlined"
              color="default"
              size="small"
              className={classes.controlButton}
              onClick={() => doZoom('in')}>
              <Add />
            </Button>

            <Button
              variant="outlined"
              color="default"
              size="small"
              className={classes.controlButton}
              onClick={() => doZoom('out')}>
              <Remove />
            </Button>
          </div>
        </Tooltip>
      </div>
      <div className={classes.canvasContainer} style={{ zoom: `${gp.zoom}%` }}>
        <div
          className={classes.editorCanvas}
          style={{
            width: canvasDimensions.width,
            minWidth: canvasDimensions.width,
            height: canvasDimensions.height,
            minHeight: canvasDimensions.height,
          }}
          ref={canvasRef}
          onDragOver={handleArrowDragOver}
          onClick={() => selectNode(undefined)}
          onDrop={handleNodeDrop}>
          {editorNodes.map((n, index) => {
            return (
              <React.Fragment key={index}>
                <div className={classes.item} style={{ left: n.x, top: n.y }}>
                  <GraphEditorNode
                    onNodeClick={(event: React.MouseEvent) =>
                      handleNodeClick(event, n.nodeId)
                    }
                    isActive={n.nodeId === selectedNodeId}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    className={classes.node}
                    nodeData={n}
                    draggable={true}
                    onEdit={() => setEditingNodeId(n.nodeId)}
                    onTerminalDragStart={handleTerminalDragStart}
                    onTerminalDragEnd={() => {
                      clearDrawingArrow();
                    }}
                    onEdgeDrop={handleEdgeDrop}
                    onNodeDragStart={() => {
                      handleNodeDragStart(n.nodeId);
                    }}
                  />
                </div>
              </React.Fragment>
            );
          })}
          {draftNodes.map((n, index) => {
            return (
              <div
                key={index}
                className={classes.item}
                style={{ left: n.x, top: n.y }}>
                <GraphEditorNode
                  className={classes.node}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  nodeData={n}
                  draggable={true}
                  onEdit={() => setEditingNodeId(n.nodeId)}
                  onTerminalDragStart={handleTerminalDragStart}
                  onTerminalDragEnd={() => {
                    clearDrawingArrow();
                  }}
                  onNodeDragStart={() => {
                    handleNodeDragStart(n.nodeId);
                  }}
                  onEdgeDrop={handleEdgeDrop}
                />
              </div>
            );
          })}
          <svg
            zoomAndPan={(gp.zoom || 100).toString()}
            xmlns="http://www.w3.org/2000/svg"
            width={'100%'}
            height={'100%'}>
            {renderArrows()}

            {drawingArrow}
          </svg>
          {editingNodeId && editingNode && (
            <UpsertNodeDialog
              onClose={() => setEditingNodeId(undefined)}
              open={editingNodeId ? true : false}
              nodeId={editingNodeId}
              agentId={agentId}
              editorNode={editingNode}
              onSuccess={handleNodeUpdate}
              intents={getAllIntents(gp)}
            />
          )}
        </div>
        {renderEdgeActions()}
      </div>
      {draggingNodeId && (
        <div
          onDrop={handleDeleteZoneDrop}
          onDragOver={handleDeleteZoneDragOver}
          onDragLeave={() => setDraggingOverDelete(false)}
          className={clsx([
            classes.deleteZone,
            draggingOverDelete ? classes.deleteZoneHovered : '',
          ])}>
          <Delete fontSize={'large'} />

          <div>Drop here to delete</div>
        </div>
      )}
    </div>
  );
};

export default GraphEditor;
