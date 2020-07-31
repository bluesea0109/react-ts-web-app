import { Card, CardContent, Chip, Badge, Typography, Tooltip, IconButton, Box, CardActions } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MessageIcon from '@material-ui/icons/Message';
import {Add, Delete, Edit, FullscreenExit} from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import {IGraphPolicyNode} from '@bavard/graph-policy';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
    },
    nodePaper: {
      backgroundColor: theme.palette.background.default,
      borderRadius: theme.spacing(1),
      minWidth: 180,
      maxWidth: 250,
      textAlign: 'center',
      overflow: 'hidden',
      margin: theme.spacing(1),
      marginTop: theme.spacing(3),
    },
    chip: {
      margin: 2,
      height: 25,
      fontSize: 11
    },
    alert: {
      marginBottom: theme.spacing(1)
    },
    utteranceText: {
      maxHeight: 95,
      overflow: "hidden"
    },
    title: {
      marginBottom: theme.spacing(1)
    },
    nodeActionsContainer: {
      display: "flex",
      justifyContent: "space-around"
    },
  }),
);

interface IGraphNodeProps {
  node: IGraphPolicyNode;
  wrapperClassName?: string;
  onAddEdge?:(nodeId:number)=>void;
  onEditNode?:(nodeId:number)=>void;
  onDeleteNode?:(nodeId:number)=>void;
}

export default function GraphNode({node, wrapperClassName, onAddEdge, onEditNode, onDeleteNode}: IGraphNodeProps) {
  const classes = useStyles();

  return (
      <Card className={`${classes.nodePaper} ${wrapperClassName}`}>
        <CardContent>
          <Typography className={classes.title} variant="subtitle2">
            <Badge badgeContent={node.nodeId} color={node.nodeId===1 ? "secondary":"primary"}/>
            &nbsp;&nbsp;&nbsp;&nbsp; {node.actionName} &nbsp;
              <Typography component="span" color="secondary" variant="subtitle2" align="right">
                {node.nodeType}
              </Typography>
          </Typography>
          <Alert icon={<MessageIcon fontSize={"small"}/>} severity="info" className={classes.alert}>
            <Tooltip disableFocusListener title={node.utterance}>
              <Typography component="div" className={classes.utteranceText} variant="caption">
                {node.utterance}
              </Typography>
            </Tooltip>
          </Alert>
          {
            node.outEdges?.map((e, index)=>{
              if(e.option?.intent) {
                return <Chip key={`${index}`} className={classes.chip} label={e.option?.intent}/>
              }
              return <></>;
            })
          }
        </CardContent>
        <CardActions className={classes.nodeActionsContainer}>
          {
            onAddEdge &&
              <Tooltip title="Add an edge">
                <IconButton color="secondary" size="small" onClick={()=>onAddEdge(node.nodeId)}>
                  <Add />
                </IconButton>
              </Tooltip> 
          }
          {
            onEditNode &&
            <Tooltip title="Edit this node">
              <IconButton color="default" size="small" onClick={()=>onEditNode(node.nodeId)}>
                <Edit />
              </IconButton>
            </Tooltip> 
          }
          {
            onDeleteNode &&
            <Tooltip title="Delete this node">
              <IconButton color="default" size="small" onClick={()=>onDeleteNode(node.nodeId)}>
                <Delete />
              </IconButton>
            </Tooltip>
          }
        </CardActions>
      </Card>

  );
}
