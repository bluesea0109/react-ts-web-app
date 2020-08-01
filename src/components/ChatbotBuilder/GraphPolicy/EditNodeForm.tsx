import { GraphPolicy} from '@bavard/graph-policy';
import { Button, Dialog, DialogActions, DialogContent,
  DialogTitle, Grid, IconButton, List, ListItem, ListItemIcon,
  ListItemSecondaryAction, ListItemText, Paper, Typography} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {Add, Delete, Image, TextFields} from '@material-ui/icons';
import React, {useState} from 'react';
import AddEdgeForm from './AddEdgeForm';
import GraphNode from './GraphNode';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fullWidth: {
      width: '100%',
    },
    nodePaper: {
      backgroundColor: theme.palette.background.default,
      borderRadius: theme.spacing(1),
      margin: theme.spacing(1),
      padding: theme.spacing(2),
    },
  }),
);

interface IGraphNodeProps {
  policy: GraphPolicy;
  nodeId: number;
  onCancel: () => void;
  onSubmit: (policy: GraphPolicy) => void;
}

export default function EditNodeForm({nodeId, policy, onCancel, onSubmit}: IGraphNodeProps) {
  const classes = useStyles();
  const [graphPolicy, setPolicy] = useState<GraphPolicy>(policy);
  const node = graphPolicy.getNodeById(nodeId);
  const [addingEdge, setAddingEdge] = useState(false);
  const [numChanges, setNumStateChanges] = useState(0);

  const removeEdge = (edgeId: number) => {
    node?.removeEdge(edgeId);
    setPolicy(graphPolicy);
    setNumStateChanges(numChanges + 1);
  };

  if (!node) {
    return <></>;
  }

  const handleAddEdge = (updPolicy: GraphPolicy) => {
    setNumStateChanges(numChanges + 1);
    setAddingEdge(false);
    setPolicy(updPolicy);
    setNumStateChanges(numChanges + 1);
  };

  return (
    <Dialog open={true} maxWidth={'lg'} onBackdropClick={onCancel} fullWidth={true}>
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
            <Paper className={classes.nodePaper}>
              <Typography variant={'h6'}>
                Edges
                <IconButton onClick={() => setAddingEdge(true)}>
                  <Add/>
                </IconButton>
              </Typography>

              {
                addingEdge ?
                <AddEdgeForm nodeId={node.nodeId} policy={graphPolicy} onSuccess={handleAddEdge} onCancel={() => {}} />
                :
                <></>
              }

              <List>
                {node.toJsonObj().outEdges.map((e, index) => {
                  return (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {e.option?.type === 'IMAGE' ? <Image/> : <TextFields/>}
                      </ListItemIcon>
                      <ListItemText>
                        {e.option?.intent}
                      </ListItemText>
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => { removeEdge(e.nodeId); }}>
                          <Delete/>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={() => onSubmit(graphPolicy)}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
