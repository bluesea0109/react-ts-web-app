import { GraphPolicyV2 } from '@bavard/agent-config/dist/graph-policy-v2';
import {
  AgentUtteranceNode,
  GraphPolicyNode,
} from '@bavard/agent-config/dist/graph-policy-v2';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import GraphEditorNode from './GraphEditorNode';
import { IGraphEditorNode } from './types';
import UpsertNodeDialog from './UpsertNodeDialog';
import { getNodeActor, snapItemPosition } from './utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      padding: theme.spacing(4),
      backgroundColor: theme.palette.grey[100],
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
  const classes = useStyles();
  const rootNode = new AgentUtteranceNode(1, 'Hello');
  const gp = new GraphPolicyV2('Test Policy', rootNode, new Set([rootNode]));
  const [changes, setChanges] = useState(0);
  const [editingNodeId, setEditingNodeId] = useState<number>();
  const [editingNode, setEditingNode] = useState<IGraphEditorNode>();

  useEffect(() => {}, [changes]);

  const allEditorNodes: IGraphEditorNode[] = [];

  const gpNodes = gp.toJsonObj().allNodes;
  gpNodes.forEach((node) => {
    allEditorNodes.push({
      node,
      itemId: node.nodeId,
      type: node.nodeType,
      actor: getNodeActor(node),
      isNew: false,
    });
  });

  const [items, setItems] = useState<IGraphEditorNode[]>(allEditorNodes);

  useEffect(() => {
    const node = _.find(items, (i) => {
      return i.itemId === editingNodeId;
    });
    if (node) {
      setEditingNode(node);
    } else {
      setEditingNode(undefined);
    }
  }, [editingNodeId, items]);

  const addItem = (nodeData: IGraphEditorNode) => {
    let newItems = items;

    if (nodeData.isNew) {
      nodeData.isNew = false;
      nodeData.itemId = items.length + 1;
      newItems.push(nodeData);
      setEditingNodeId(nodeData.itemId);
    } else {
      const itemId = nodeData.itemId;
      if (itemId) {
        newItems = _.filter(newItems, (i) => {
          return i.itemId !== itemId;
        });

        newItems.push(nodeData);
      }
    }

    setItems(newItems);
    setChanges(changes + 1);
  };

  const handleNodeUpdate = (node: GraphPolicyNode) => {
    const nodeData = _.find(items, (i) => {
      return i.itemId === node.nodeId;
    });

    if (nodeData) {
      nodeData.node = node.toJsonObj();
      addItem(nodeData);
    }

    setEditingNodeId(undefined);
  };

  return (
    <div className={classes.root}>
      <div
        className={classes.editorCanvas}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          const data: IGraphEditorNode = JSON.parse(
            event.dataTransfer.getData('NODE_DATA'),
          );

          const rect = event.currentTarget.getBoundingClientRect();

          const pos = snapItemPosition(
            event.clientX - rect.x - 150,
            event.clientY - rect.y - 10,
          );

          data.x = pos.x;
          data.y = pos.y;

          addItem(data);
        }}>
        {items.map((i, index) => {
          return (
            <div
              key={index}
              className={classes.item}
              style={{ left: i.x, top: i.y }}>
              <GraphEditorNode
                nodeData={i}
                draggable={true}
                onEdit={() => setEditingNodeId(i.itemId)}
              />
            </div>
          );
        })}

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
