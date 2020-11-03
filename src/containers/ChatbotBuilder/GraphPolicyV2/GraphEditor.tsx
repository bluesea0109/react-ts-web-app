import { GraphPolicyV2 } from '@bavard/agent-config/dist/graph-policy-v2';

import {
  AgentNode,
  AgentUtteranceNode,
  GraphPolicyNode,
  UserNode,
} from '@bavard/agent-config/dist/graph-policy-v2';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useEffect, useRef, useState } from 'react';
import GraphEditorNode from './GraphEditorNode';
import SvgArrow from './SvgArrow';
import { IGraphEditorNode, IItemPosition } from './types';
import UpsertNodeDialog from './UpsertNodeDialog';
import { getArrowCoords, getNodeActor, snapItemPosition } from './utils';

const NODE_WIDTH = 150;
const NODE_HEIGHT = 75;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      padding: theme.spacing(4),
    },
    editorCanvas: {
      position: 'relative',
      display: 'flex',
      height: 5000,
      minWidth: 10000,
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
    },
    item: {
      position: 'absolute',
    },
    textArea: {
      width: '100%',
    },
  }),
);

interface IProps {
  agentId: number;
}

const GraphEditor = ({ agentId }: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const rootNode = new AgentUtteranceNode(1, 'Hello');
  rootNode.position = {
    x: 20,
    y: 20,
  };

  const policy = new GraphPolicyV2(
    'Test Policy',
    rootNode,
    new Set([rootNode]),
  );
  const [gp, setGp] = useState<GraphPolicyV2>(policy);
  const containerRef = useRef<HTMLDivElement>(null);
  const [changes, setChanges] = useState(0);
  const [editingNodeId, setEditingNodeId] = useState<number>();
  const [editingNode, setEditingNode] = useState<IGraphEditorNode>();
  const [draftNodes, setDraftNodes] = useState<IGraphEditorNode[]>([]);

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

  useEffect(() => {}, [changes]);

  const [drawingArrowStart, setDrawingArrowStart] = useState<IItemPosition>();
  const [drawingArrowEnd, setDrawingArrowEnd] = useState<IItemPosition>();

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

  const handleNodeDrop = (event: React.DragEvent<HTMLDivElement>) => {
    setDrawingArrowEnd(undefined);
    setDrawingArrowStart(undefined);

    const data: IGraphEditorNode = JSON.parse(
      event.dataTransfer.getData('NODE_DATA') || '{}',
    );

    if (_.isEmpty(data)) {
      return;
    }

    // Get relative position to canvas
    const rect = event.currentTarget.getBoundingClientRect();

    const pos = snapItemPosition(
      event.clientX - rect.x - 150,
      event.clientY - rect.y - 10,
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
    gp.deleteNodeById(node.nodeId);
    gp.addNode(node);

    setGp(gp);
    setEditingNodeId(undefined);
  };

  const handleTerminalDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeData: IGraphEditorNode,
  ) => {
    const rect = containerRef.current?.getBoundingClientRect();

    const start = {
      x: event.clientX - (rect?.x || 0),
      y: event.clientY - (rect?.y || 0),
    };

    setDrawingArrowStart(start);

    event.dataTransfer.setData(
      'DRAGGING_OUT_TERMINAL',
      JSON.stringify(nodeData || '{}'),
    );
  };

  const handleEdgeDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetNode: IGraphEditorNode,
  ) => {
    console.log('DROPPED TERMINAL', event);
    console.log('NODE DATA: ', targetNode);

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

          // Add the child node - either agent or user node
          gpSource.addChild(gpTarget);
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

    setDrawingArrowStart(undefined);
    setDrawingArrowEnd(undefined);
  };

  const handleArrowDragOver = _.throttle(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const rect = event.currentTarget.getBoundingClientRect();

      setDrawingArrowEnd({
        x: event.clientX - rect.x,
        y: event.clientY - rect.y,
      });
    },
    500,
  );

  const renderArrows = () => {
    const arrows: React.ReactNode[] = [];
    const nodes = gp.getAllNodes();
    nodes.forEach((node) => {
      if (node.childAgentNode) {
        const caNode = node.childAgentNode;
        const coords = getArrowCoords(node, caNode, NODE_HEIGHT, NODE_WIDTH);
        arrows.push(
          <SvgArrow
            key={`arrow_${node.nodeId}_${caNode.nodeId}`}
            startElementId={node.nodeId}
            endElementId={caNode.nodeId}
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
            <SvgArrow
              key={`arrow_${node.nodeId}_${cuNode.nodeId}`}
              startElementId={node.nodeId}
              endElementId={cuNode.nodeId}
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

  return (
    <div className={classes.root}>
      <div
        className={classes.editorCanvas}
        ref={containerRef}
        onDragOver={handleArrowDragOver}
        onDrop={handleNodeDrop}>
        {editorNodes.map((n, index) => {
          return (
            <React.Fragment key={index}>
              <div className={classes.item} style={{ left: n.x, top: n.y }}>
                <GraphEditorNode
                  nodeData={n}
                  draggable={true}
                  onEdit={() => setEditingNodeId(n.nodeId)}
                  onTerminalDragStart={handleTerminalDragStart}
                  onEdgeDrop={handleEdgeDrop}
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
                nodeData={n}
                draggable={true}
                onEdit={() => setEditingNodeId(n.nodeId)}
                onTerminalDragStart={handleTerminalDragStart}
                onEdgeDrop={handleEdgeDrop}
              />
            </div>
          );
        })}
        <svg xmlns="http://www.w3.org/2000/svg" width={'100%'} height={'100%'}>
          {renderArrows()}

          {drawingArrowStart && drawingArrowEnd && (
            <SvgArrow
              startElementId={drawingArrowStart.x}
              endElementId={drawingArrowEnd.y}
              x1={drawingArrowStart.x}
              x2={drawingArrowEnd.x}
              y1={drawingArrowStart.y}
              y2={drawingArrowEnd.y}
            />
          )}
        </svg>

        {editingNodeId && editingNode && (
          <UpsertNodeDialog
            onClose={() => setEditingNodeId(undefined)}
            open={editingNodeId ? true : false}
            nodeId={editingNodeId}
            agentId={agentId}
            editorNode={editingNode}
            onSuccess={handleNodeUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default GraphEditor;
