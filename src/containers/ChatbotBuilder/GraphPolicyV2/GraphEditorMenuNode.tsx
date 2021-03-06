import {
  EAgentNodeTypes,
  EUserNodeTypes,
} from '@bavard/agent-config/dist/graph-policy-v2/nodes';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { ENodeActor } from './types';

import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    node: {
      width: 108,
      height: 32,
      lineHeight: `32px`,
      borderRadius: theme.spacing(4),
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
      textTransform: 'capitalize',
      color: theme.palette.primary.contrastText,
      cursor: 'move',
    },
    userNode: {
      background: theme.palette.success.dark,
    },
    agentNode: {
      background: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
  }),
);

interface IProps {
  actor: ENodeActor;
  type: EUserNodeTypes | EAgentNodeTypes;
  text: string;
  className?: string;
  draggable?: boolean;
}
const GraphNode = ({ actor, type, text, className, draggable }: IProps) => {
  const classes = useStyles();

  const nodeClass =
    actor === ENodeActor.USER ? classes['userNode'] : classes['agentNode'];

  return (
    <div
      className={clsx([classes.node, nodeClass, className])}
      draggable={draggable}
      onDragStart={(event) => {
        event.dataTransfer.setData(
          'NODE_DATA',
          JSON.stringify({ actor, type, isNew: true }),
        );
      }}>
      {text}
    </div>
  );
};

export default GraphNode;
