import { GraphPolicyNode } from '@bavard/graph-policy';
import { Card, CardActions, CardContent, IconButton, Tooltip, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {Add, Delete, Edit} from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import EdgeChip from './EdgeChip';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
    },
    nodePaper: {
      backgroundColor: theme.palette.background.default,
      borderRadius: theme.spacing(1),
      minWidth: 180,
      maxWidth: 300,
      textAlign: 'center',
      overflow: 'hidden',
    },
    optionContainer: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    option: {
      height: 30,
      display: 'flex',
      backgroundColor: theme.palette.background.paper,
      fontSize: 11,
      padding: 2,
      margin: 2,
      borderRadius: theme.spacing(1),
      alignItems: 'center',
    },
    optionText: {
      padding: theme.spacing(1),
    },
    optionImg: {
      height: 30,
      width: 30,
    },
    alert: {
      marginBottom: theme.spacing(1),
    },
    utteranceText: {
      maxHeight: 95,
      overflow: 'hidden',
    },
    title: {
      marginBottom: theme.spacing(1),
      fontWeight: 'bold',
    },
    nodeActionsContainer: {
      display: 'flex',
      justifyContent: 'space-around',
    },
  }),
);

interface IGraphNodeProps {
  node: GraphPolicyNode;
  wrapperClassName?: string;
  onAddEdge?: (nodeId: number) => void;
  onEditNode?: (nodeId: number) => void;
  onDeleteNode?: (nodeId: number) => void;
}

export default function GraphNode({node, wrapperClassName, onAddEdge, onEditNode, onDeleteNode}: IGraphNodeProps) {
  const classes = useStyles();
  const nodeJson = node.toJsonObj();

  return (
      <Card className={`${classes.nodePaper} ${wrapperClassName}`}>
        <CardContent>
          <Typography className={classes.title} variant="subtitle2">
            {node.nodeId}. {node.actionName} &nbsp;
            <Typography component="span" variant="subtitle2" color="secondary" align="right">
              {nodeJson.nodeType}
            </Typography>
          </Typography>
          <Alert icon={false} severity="info" className={classes.alert}>
            <Tooltip disableFocusListener={true} title={nodeJson.utterance}>
              <Typography component="div" className={classes.utteranceText} variant="caption">
                {nodeJson.utterance}
              </Typography>
            </Tooltip>
          </Alert>
          {
            (node.edges?.length >= 1) ?
            <div className={classes.optionContainer}>
              {node.toJsonObj().outEdges.map((e, index) => {
                return <EdgeChip node={node} edgeId={e.nodeId} key={index}/>;
              })}
            </div>
            :
            <></>
          }
        </CardContent>
        <CardActions className={classes.nodeActionsContainer}>
          {
            onAddEdge &&
              <Tooltip title="Add an edge">
                <IconButton color="secondary" size="small" onClick={() => onAddEdge(node.nodeId)}>
                  <Add />
                </IconButton>
              </Tooltip>
          }
          {
            onEditNode &&
            <Tooltip title="Edit this node">
              <IconButton color="default" size="small" onClick={() => onEditNode(node.nodeId)}>
                <Edit />
              </IconButton>
            </Tooltip>
          }
          {
            onDeleteNode &&
            <Tooltip title="Delete this node">
              <IconButton color="default" size="small" onClick={() => onDeleteNode(node.nodeId)}>
                <Delete />
              </IconButton>
            </Tooltip>
          }
        </CardActions>
      </Card>

  );
}
