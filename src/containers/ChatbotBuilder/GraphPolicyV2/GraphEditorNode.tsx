import React, { useState } from 'react';

import {
  EAgentNodeTypes,
  EUserNodeTypes,
} from '@bavard/agent-config/dist/graph-policy-v2/nodes';
import { IconButton } from '@material-ui/core';
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    node: {
      width: 150,
      height: 75,
      borderRadius: theme.spacing(1),
      textTransform: 'capitalize',
      background: 'transparent',
      position: 'relative',
      display: 'flex',
      boxShadow: theme.shadows[5],
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
    },
    dragging: {
      boxShadow: theme.shadows[20],
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
  }),
);

interface IProps {
  nodeData: IGraphEditorNode;
  className?: string;
  children?: React.ReactNode;
  draggable?: boolean;
  onEdit?: () => void;
}
const GraphEditorNode = ({
  nodeData,
  className,
  draggable,
  onEdit,
}: IProps) => {
  const classes = useStyles();
  const [canDrag, setCanDrag] = useState(false);

  let nodeClass =
    nodeData.actor === ENodeActor.USER
      ? classes['userNode']
      : classes['agentNode'];

  if (!nodeData.node) {
    nodeClass = classes.withoutData;
  }

  let nodeTitle = '';
  let nodeText = '';

  switch (nodeData.type) {
    case EAgentNodeTypes.AGENT_UTTERANCE: {
      nodeTitle = 'Utterance';
      const n = nodeData.node as IAgentUtteranceNode;
      nodeText = n?.utterance;
      break;
    }
    case EAgentNodeTypes.AGENT_EMAIL: {
      nodeTitle = 'Email';
      const n = nodeData.node as IAgentEmailNode;

      nodeText = n?.prompt;
      break;
    }
    case EAgentNodeTypes.AGENT_FORM: {
      nodeTitle = 'Form';
      break;
    }
    case EUserNodeTypes.USER_IMAGE_OPTION: {
      nodeTitle = 'Image Option';
      const n = nodeData.node as IUserImageOptionNode;
      nodeText = n?.text || '';
      break;
    }
    case EUserNodeTypes.USER_TEXT_OPTION: {
      nodeTitle = 'Text';
      const n = nodeData.node as IUserTextOptionNode;
      nodeText = n?.text;
      break;
    }
    case EUserNodeTypes.USER_SUBMIT: {
      nodeTitle = 'Submit';
      break;
    }
  }

  return (
    <div
      className={clsx([
        classes.node,
        nodeClass,
        className,
        canDrag ? classes.dragging : '',
      ])}
      draggable={draggable && canDrag}
      onDragStart={(event) => {
        console.log('SETTING NODE DATA ');
        event.dataTransfer.setData('NODE_DATA', JSON.stringify(nodeData));
      }}
      onDragEnd={() => {
        setCanDrag(false);
      }}>
      <div className={classes.nodeContent}>
        <div>{nodeTitle}</div>
        <div
          className={classes.nodeText}
          dangerouslySetInnerHTML={{ __html: nodeText }}/>
      </div>
      <div className={classes.nodeActions}>
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
          <OpenWith className={classes.actionIcon} />
        </IconButton>
        <IconButton size="small" onClick={onEdit}>
          <Edit className={classes.actionIcon} />
        </IconButton>
      </div>
    </div>
  );
};

export default GraphEditorNode;
