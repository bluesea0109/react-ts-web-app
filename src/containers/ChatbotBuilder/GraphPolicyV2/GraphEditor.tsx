// import { GraphPolicyV2 } from '@bavard/agent-config/dist/graph-policy-v2';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import GraphEditorNode from './GraphEditorNode';
import { IGraphEditorNode } from './types';
import { snapItemPosition } from './utils';

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

const GraphEditor = () => {
  const classes = useStyles();
  const [items, setItems] = useState<IGraphEditorNode[]>([]);
  const [changes, setChanges] = useState(0);

  useEffect(() => {
    console.log('ITEMS CHANGED');
  }, [changes]);

  const addItem = (nodeData: IGraphEditorNode) => {
    const newItems = items;

    if (nodeData.isNew) {
      nodeData.isNew = false;
      newItems.push(nodeData);
    } else {
    }

    setItems(newItems);
    setChanges(changes + 1);
    console.log({ newItems, items });
  };

  return (
    <div className={classes.root}>
      <div
        className={classes.editorCanvas}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          console.log('dropped', event);
          const data: IGraphEditorNode = JSON.parse(
            event.dataTransfer.getData('NODE_DATA'),
          );
          console.log('DATA: ', data);
          const rect = event.currentTarget.getBoundingClientRect();
          console.log('RECT: ', rect);
          console.log(event.clientX, event.clientY);

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
              <GraphEditorNode nodeData={i} draggable={true} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GraphEditor;
