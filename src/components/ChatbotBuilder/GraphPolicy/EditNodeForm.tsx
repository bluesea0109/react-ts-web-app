import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Grid, Card, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MessageIcon from '@material-ui/icons/Message';
import {Image, TextFields, Delete} from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import React, {useState} from 'react';
import {IGraphPolicyNode, GraphPolicy, GraphPolicyNode} from '@bavard/graph-policy';
import GraphNode from './GraphNode';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fullWidth: {
      width: '100%'
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
  }),
);

interface IGraphNodeProps {
  policy: GraphPolicy;
  nodeId: number;
  onCancel: ()=>void;
  onSubmit: (policy:GraphPolicy)=>void;
}

export default function EditNodeForm({nodeId, policy, onCancel, onSubmit}: IGraphNodeProps) {
  const classes = useStyles();
  const [graphPolicy, setPolicy] = useState(policy);
  const [node, setNode] = useState(graphPolicy.getNodeById(nodeId));


  const removeEdge = (edgeId: number) => {
    console.log("REMOVING EDGE: ", edgeId);
    node?.removeEdge(edgeId);
    console.log("EDGE REMOVED: ", node);
    console.log("GRAPH POLICY: ", graphPolicy);
    setPolicy(graphPolicy);
    console.log("POLICY SET: ", node);
    setNode(node);
  }

  if(!node) {
    return <></>
  }

  console.log("NODE: ", node);

  return (
    <Dialog open={true} maxWidth={"lg"} onBackdropClick={onCancel} fullWidth={true}>
      <DialogTitle>
        Edit Node
      </DialogTitle>
      <DialogContent>
        <Grid container={true} className={classes.fullWidth}>
          <Grid item={true} lg={4} md={12}>
            <GraphNode 
              node={node.toJsonObj()} 
            />
          </Grid>
          <Grid item={true} lg={8} md={12}>
            <List>
              {node.toJsonObj().outEdges.map((e)=> {
                return (
                  <ListItem>
                    <ListItemIcon>
                      {e.option?.type === "IMAGE"? <Image/> : <TextFields/>}
                    </ListItemIcon>
                    <ListItemText>
                      {e.option?.intent}
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton onClick={()=>{ removeEdge(e.nodeId) }}>
                        <Delete/>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              })}
            </List>
          </Grid>
        </Grid>    
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button color="primary" onClick={()=>onSubmit(graphPolicy)}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
