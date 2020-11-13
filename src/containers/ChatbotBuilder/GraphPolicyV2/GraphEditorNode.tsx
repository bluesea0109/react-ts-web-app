import React, { useState } from 'react';

import {
  EAgentNodeTypes,
  EUserNodeTypes,
} from '@bavard/agent-config/dist/graph-policy-v2/nodes';

import { IconButton, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Edit, OpenWith } from '@material-ui/icons';
import clsx from 'clsx';
import { ENodeActor, IGraphEditorNode } from './types';

import {
  IAgentEmailNode,
  IAgentUtteranceNode,
  IUserImageOptionNode,
  IUserTextOptionNode,
} from '@bavard/agent-config/dist/graph-policy-v2';

const TERMINAL_SIZE = 16;
const TERMINAL_RADIUS = Math.round(TERMINAL_SIZE / 2);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    node: {
      width: 150,
      height: 75,
      textTransform: 'capitalize',
      background: 'transparent',
      position: 'relative',
      display: 'flex',
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
      background: theme.palette.grey[300],
      color: theme.palette.grey[800],
      '& $actionIcon': {
        color: theme.palette.grey[800],
      },
    },
    nodeActive: {
      border: `dashed 2px #FFFFFF`,
    },
    dragging: {
      boxShadow: theme.shadows[20],
      border: `dashed 2px #FFFFFF`,
    },
    nodeActions: {
      width: 30,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    nodeContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
      width: 'auto',
      flex: 1,
      wordBreak: 'break-word',
    },
    nodeText: {
      width: 100,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    dragHandle: {
      cursor: 'move',
    },
    actionIcon: {
      color: theme.palette.primary.contrastText,
      width: 20,
      height: 20,
    },
    terminal: {
      backgroundColor: '#FFFFFF',
      minWidth: Math.round(TERMINAL_SIZE * 0.9),
      minHeight: Math.round(TERMINAL_SIZE * 0.9),
      width: Math.round(TERMINAL_SIZE * 0.9),
      height: Math.round(TERMINAL_SIZE * 0.9),
      border: `solid ${Math.round(TERMINAL_SIZE * 0.1)}px #FFFFFF`,
      borderColor: theme.palette.info.main,
      position: 'absolute',
      borderRadius: '50%',
      cursor: 'crosshair',
      '&:hover': {
        boxShadow: theme.shadows[10],
        backgroundColor: theme.palette.secondary.main,
      },
    },
    terminalHovered: {
      boxShadow: theme.shadows[20],
      backgroundColor: theme.palette.secondary.main,
    },
    terminalTop: {
      top: -TERMINAL_RADIUS,
      left: `calc(50% - ${TERMINAL_RADIUS}px)`,
    },
    terminalLeft: {
      left: -TERMINAL_RADIUS,
      top: `calc(50% - ${TERMINAL_RADIUS}px)`,
    },
    terminalRight: {
      right: -TERMINAL_RADIUS,
      top: `calc(50% - ${TERMINAL_RADIUS}px)`,
    },
    terminalBottom: {
      bottom: -TERMINAL_RADIUS,
      left: `calc(50% - ${TERMINAL_RADIUS}px)`,
    },
    terminalAgent: {
      backgroundColor: '#FFFFFF',
    },
    terminalUser: {
      backgroundColor: '#FFFFFF',
    },
    terminalDragHandle: {
      position: 'relative',
      opacity: 0.999,
      width: '300%',
      height: '300%',
      background: 'transparent',
      margin: '-75%',
    },
  }),
);

interface IProps {
  nodeData: IGraphEditorNode;
  className?: string;
  children?: React.ReactNode;
  draggable?: boolean;
  width?: number;
  height?: number;
  isActive?: boolean;
  onNodeDragStart?: () => void;
  onNodeClick?: (event: React.MouseEvent) => void;
  onEdit?: () => void;
  onTerminalDragStart?: (
    event: React.DragEvent<HTMLDivElement>,
    nodeData: IGraphEditorNode,
  ) => void;
  onTerminalDragEnd?: (
    event: React.DragEvent<HTMLDivElement>,
    nodeData: IGraphEditorNode,
  ) => void;
  onEdgeDrop?: (
    event: React.DragEvent<HTMLDivElement>,
    nodeData: IGraphEditorNode,
  ) => void;
}
const GraphEditorNode = ({
  nodeData,
  className,
  draggable,
  onEdit,
  onTerminalDragStart,
  onTerminalDragEnd,
  onNodeDragStart,
  onEdgeDrop,
  isActive,
  onNodeClick,
  width,
  height,
}: IProps) => {
  const classes = useStyles();
  const [canDrag, setCanDrag] = useState(false);
  const [showTerminals, setShowTerminals] = useState(false);
  const [draggingOver, setDraggingOver] = useState(false);
  const nodeWidth = width || 150;
  const nodeHeight = height || 75;

  let nodeClass =
    nodeData.actor === ENodeActor.USER
      ? classes['userNode']
      : classes['agentNode'];

  const terminalClass =
    nodeData.actor === ENodeActor.USER
      ? classes.terminalUser
      : classes.terminalAgent;

  if (!nodeData.node) {
    nodeClass = classes.withoutData;
  }

  let nodeTitle = '';
  let nodeText = '';

  switch (nodeData.type) {
    case EAgentNodeTypes.AGENT_UTTERANCE: {
      nodeTitle = 'Utterance';
      const n = nodeData.node?.toJsonObj() as IAgentUtteranceNode;
      nodeText = n?.utterance;
      break;
    }
    case EAgentNodeTypes.AGENT_EMAIL: {
      nodeTitle = 'Email';
      const n = nodeData.node?.toJsonObj() as IAgentEmailNode;

      nodeText = n?.prompt;
      break;
    }
    case EAgentNodeTypes.AGENT_FORM: {
      nodeTitle = 'Form';
      break;
    }
    case EUserNodeTypes.USER_IMAGE_OPTION: {
      nodeTitle = 'Image Option';
      const n = nodeData.node?.toJsonObj() as IUserImageOptionNode;
      nodeText = n?.text || '';
      break;
    }
    case EUserNodeTypes.USER_TEXT_OPTION: {
      nodeTitle = 'Text';
      const n = nodeData.node?.toJsonObj() as IUserTextOptionNode;
      nodeText = n?.text;
      break;
    }
    case EUserNodeTypes.USER_SUBMIT: {
      nodeTitle = 'Submit';
      break;
    }
  }

  const terminalDragHandle = (
    <Tooltip title="Drag to another node to add it as an edge">
      <div
        className={classes.terminalDragHandle}
        onDragStart={(event) => onTerminalDragStart?.(event, nodeData)}
        onDragEnd={(event) => onTerminalDragEnd?.(event, nodeData)}
        draggable={true}
      />
    </Tooltip>
  );

  return (
    <div
      onClick={onNodeClick}
      onMouseEnter={() => setShowTerminals(true)}
      onMouseLeave={() => setShowTerminals(false)}
      onDrop={(event) => {
        onEdgeDrop?.(event, nodeData);
        setDraggingOver(false);
      }}
      onDragOver={() => {
        setDraggingOver(true);
      }}
      onDragLeave={() => {
        setDraggingOver(false);
      }}
      className={clsx([
        classes.node,
        nodeClass,
        className,
        canDrag ? classes.dragging : '',
        draggingOver || isActive ? classes.nodeActive : '',
      ])}
      style={{
        width: nodeWidth,
        height: nodeHeight,
      }}
      draggable={draggable && canDrag}
      onDragStart={(event) => {
        if (!canDrag) {
          return;
        }
        event.dataTransfer.setData('NODE_DATA', JSON.stringify(nodeData));
        setDraggingOver(false);
        onNodeDragStart?.();
      }}
      onDragEnd={() => {
        setCanDrag(false);
        setDraggingOver(false);
      }}>
      <div className={classes.nodeContent}>
        <div>{nodeTitle}</div>
        <div
          className={classes.nodeText}
          dangerouslySetInnerHTML={{ __html: nodeText }}
          style={{ width: nodeWidth - 50 }}
        />
      </div>
      <div className={classes.nodeActions}>
        <IconButton
          className={classes.dragHandle}
          size="small"
          onMouseDown={() => {
            setCanDrag(true);
          }}
          onMouseUp={() => {
            setCanDrag(false);
          }}>
          <OpenWith className={classes.actionIcon} />
        </IconButton>
        <IconButton size="small" onClick={onEdit}>
          <Edit className={classes.actionIcon} />
        </IconButton>
      </div>
      {showTerminals && nodeData.node && (
        <React.Fragment>
          <div
            className={clsx([
              classes.terminal,
              classes.terminalBottom,
              terminalClass,
            ])}>
            {terminalDragHandle}
          </div>
          <div
            className={clsx([
              classes.terminal,
              classes.terminalTop,
              terminalClass,
            ])}>
            {terminalDragHandle}
          </div>
          <div
            className={clsx([
              classes.terminal,
              classes.terminalRight,
              terminalClass,
            ])}>
            {terminalDragHandle}
          </div>
          <div
            className={clsx([
              classes.terminal,
              classes.terminalLeft,
              terminalClass,
            ])}>
            {terminalDragHandle}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default GraphEditorNode;
