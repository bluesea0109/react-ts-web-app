import {
  EAgentNodeTypes,
  EUserNodeTypes,
} from '@bavard/agent-config/dist/graph-policy-v2/nodes';
import { Card, Theme, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';

import React from 'react';
import GraphEditorMenuNode from './GraphEditorMenuNode';
import { ENodeActor } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    categoryHead: {
      backgroundColor: theme.palette.grey[100],
      padding: theme.spacing(2),
    },
    categoryItems: {
      padding: theme.spacing(2),
    },
    menuNode: {
      marginBottom: theme.spacing(1),
      opacity: 0.999,
    },
  })
);

interface IProps {
  className?: string;
}

const GraphEditorMenu = ({ className }: IProps) => {
  const classes = useStyles();
  return (
    <Card className={className}>
      <div className={classes.categoryHead}>
        <Typography variant="h6">Assistant Nodes - </Typography>
        <Typography variant="subtitle2">Assistant Actions</Typography>
      </div>

      <div className={classes.categoryItems}>
        <GraphEditorMenuNode
          actor={ENodeActor.AGENT}
          type={EAgentNodeTypes.AGENT_UTTERANCE}
          draggable={true}
          text="Utterance"
          className={classes.menuNode}
        />
        <GraphEditorMenuNode
          actor={ENodeActor.AGENT}
          type={EAgentNodeTypes.AGENT_FORM}
          draggable={true}
          text="Form"
          className={classes.menuNode}
        />
        <GraphEditorMenuNode
          actor={ENodeActor.AGENT}
          type={EAgentNodeTypes.AGENT_EMAIL}
          draggable={true}
          text="Email"
          className={classes.menuNode}
        />
      </div>

      <div className={classes.categoryHead}>
        <Typography variant="h6">User Nodes - </Typography>
        <Typography variant="subtitle2">User Choices</Typography>
      </div>
      <div className={classes.categoryItems}>
        <GraphEditorMenuNode
          actor={ENodeActor.USER}
          type={EUserNodeTypes.USER_TEXT_OPTION}
          draggable={true}
          text="Text Option"
          className={classes.menuNode}
        />
        <GraphEditorMenuNode
          actor={ENodeActor.USER}
          type={EUserNodeTypes.USER_IMAGE_OPTION}
          draggable={true}
          text="Image Option"
          className={classes.menuNode}
        />
        <GraphEditorMenuNode
          actor={ENodeActor.USER}
          type={EUserNodeTypes.USER_SUBMIT}
          draggable={true}
          text="Submit"
          className={classes.menuNode}
        />
      </div>
    </Card>
  );
};
export default GraphEditorMenu;
