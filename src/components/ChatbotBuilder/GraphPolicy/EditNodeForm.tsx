import { GraphPolicy } from '@bavard/graph-policy';
import {  Button, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, Grid, IconButton,
  Paper, TextField, Typography} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {Add, Delete, Edit} from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState} from 'react';
import EdgeChip from './EdgeChip';
import GraphNode from './GraphNode';
import UpsertEdge from './UpsertEdge';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fullWidth: {
      width: '100%',
    },
    nodePaper: {
      backgroundColor: theme.palette.background.default,
      borderRadius: theme.spacing(1),
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    formControl: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
  }),
);

interface IGraphNodeProps {
  policy: GraphPolicy;
  nodeId: number;
  agentId: number;
  onCancel: () => void;
  onUpdate?: () => void;
  onSubmit: (policy: GraphPolicy) => void;
}

export default function EditNodeForm({nodeId, agentId, policy, onCancel, onSubmit, onUpdate}: IGraphNodeProps) {
  const classes = useStyles();
  const [graphPolicy, setPolicy] = useState<GraphPolicy>(policy);
  const node = graphPolicy.getNodeById(nodeId);
  const [upsertingEdge, setUpsertingEdge] = useState(false);
  const [actionName, setActionName] = useState(node?.actionName || '');
  const [utterance, setUtterance] = useState(node?.toJsonObj().utterance || '');
  const [editingEdgeId, setEditingEdgeId] = useState<number|undefined>();
  const [numChanges, setNumStateChanges] = useState(0);
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    setUpsertingEdge(false);
  }, [editingEdgeId]);

  const removeEdge = (edgeId: number) => {
    node?.removeEdge(edgeId);
    setPolicy(graphPolicy);
    onUpdate?.();
    setNumStateChanges(numChanges + 1);
  };

  if (!node) {
    return <></>;
  }

  const handleAddEdge = (updPolicy: GraphPolicy) => {
    setNumStateChanges(numChanges + 1);
    setUpsertingEdge(false);
    setPolicy(updPolicy);
    onUpdate?.();
    setNumStateChanges(numChanges + 1);
  };

  const validateAndSubmit = () => {
    if (!node) {
      return;
    }
    if (!actionName.length || !utterance.length) {
      return enqueueSnackbar('Action name and Utterance are invalid', {variant: 'error'});
    }

    node.setActionName(actionName);
    node.setUtterance(utterance);

    onSubmit(graphPolicy);
  };

  return (
    <Dialog open={true} maxWidth={'lg'} onBackdropClick={onCancel} fullWidth={true}>
      <DialogTitle>
        Edit Node
      </DialogTitle>
      <DialogContent>
        <Grid container={true} className={classes.fullWidth} spacing={2}>
          <Grid item={true} lg={3} md={12}>
            <Paper className={classes.nodePaper}>
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField name="actionName" defaultValue={actionName} label="Action Name"
                  variant="outlined" onChange={(e) => setActionName(e.target.value as string)} />
              </FormControl>
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField multiline={true} rowsMax={5} name="utterance" defaultValue={utterance}
                  label="Utterance" variant="outlined" onChange={(e) => setUtterance(e.target.value as string)} />
              </FormControl>
            </Paper>

            <GraphNode
              node={node}
            />
          </Grid>
          <Grid item={true} lg={4} md={12}>
            <Paper className={classes.nodePaper}>
              <Typography variant={'h6'}>
                Edges
                <IconButton onClick={() => { setEditingEdgeId(undefined); setTimeout(() => setUpsertingEdge(true), 200); }}>
                  <Add/>
                </IconButton>
              </Typography>

                {node.toJsonObj().outEdges.map((e, index) => {
                  return (
                    <EdgeChip node={node} key={`${node.nodeId}_${index}`} edgeId={e.nodeId} actions={
                      <React.Fragment>
                        <IconButton onClick={() => { setEditingEdgeId(e.nodeId); setTimeout(() => setUpsertingEdge(true), 200); }}>
                          <Edit/>
                        </IconButton>
                        <IconButton onClick={() => { removeEdge(e.nodeId); }}>
                          <Delete/>
                        </IconButton>
                      </React.Fragment>
                    }/>
                  );
                })}
            </Paper>
          </Grid>
          <Grid item={true} lg={5} md={12}>
            {
              upsertingEdge ?
              <UpsertEdge agentId={agentId} edgeId={editingEdgeId} nodeId={node.nodeId}
                policy={graphPolicy} onSuccess={handleAddEdge} onCancel={onCancel} />
              :
              <></>
            }
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={validateAndSubmit}>Submit</Button>
      </DialogActions>

    </Dialog>
  );
}
