import React, { useState } from 'react';

import { IconButton } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { OpenWith } from '@material-ui/icons';
import clsx from 'clsx';
import { ENodeActor, IGraphEditorNode } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    node: {
      width: 150,
      height: 75,
      borderRadius: theme.spacing(1),
      padding: theme.spacing(1),
      textTransform: 'capitalize',
      background: 'transparent',
      position: 'relative',
    },
    userNode: {
      background: theme.palette.success.dark,
      color: theme.palette.success.contrastText,
    },
    agentNode: {
      background: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
    withoutData: {
      background: theme.palette.grey[200],
      color: theme.palette.grey[500],
    },
    dragHandle: {
      color: theme.palette.primary.contrastText,
      position: 'absolute',
      top: 0,
      right: 0,
      cursor: 'move',
    },
  }),
);

interface IProps {
  nodeData: IGraphEditorNode;
  className?: string;
  children?: React.ReactNode;
  draggable?: boolean;
}
const GraphEditorNode = ({ nodeData, className, draggable }: IProps) => {
  const classes = useStyles();
  const [canDrag, setCanDrag] = useState(false);

  let nodeClass =
    nodeData.actor === ENodeActor.USER
      ? classes['userNode']
      : classes['agentNode'];

  if (!nodeData.node) {
    nodeClass = classes.withoutData;
  }

  return (
    <div
      className={clsx([classes.node, nodeClass, className])}
      draggable={draggable && canDrag}
      onDragStart={(event) => {
        console.log('SETTING NODE DATA ');
        event.dataTransfer.setData('NODE_DATA', JSON.stringify(nodeData));
      }}
      onDragEnd={() => {
        setCanDrag(false);
      }}>
      <IconButton
        className={classes.dragHandle}
        size="small"
        onMouseDown={() => {
          console.log('MOUSE DOWN CAN DRAG ', canDrag);
          setCanDrag(true);
        }}
        onMouseUp={() => {
          console.log('MOUSE UP CAN DRAG ', canDrag);
          setCanDrag(false);
        }}>
        <OpenWith />
      </IconButton>
      {nodeData.type} Node
    </div>
  );
};

export default GraphEditorNode;
