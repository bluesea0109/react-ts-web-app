import { BaseEdge, GraphEdgeType, GraphPolicy} from '@bavard/graph-policy';
import { FormControl, FormControlLabel, FormLabel,
  Paper, Radio, RadioGroup, Typography} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState} from 'react';
import UpsertEdgeForm from './UpsertEdgeForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    nodePaper: {
      borderRadius: theme.spacing(1),
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
    },
  }),
);

interface IUpsertEdgeProps {
  agentId: number;
  nodeId: number;
  onCancel: () => void;
  onSuccess: (policy: GraphPolicy) => void;
  policy: GraphPolicy;
  edgeId?: number;
}

export default function UpsertEdge({agentId, nodeId, policy, edgeId , onCancel, onSuccess}: IUpsertEdgeProps) {
  const classes = useStyles();
  const node = policy.getNodeById(nodeId);
  let edge: BaseEdge | undefined;
  if (edgeId) {
    edge = node?.getEdgeById(edgeId);
  }

  const [edgeType, setEdgeType] = useState<GraphEdgeType>(edge?.type || 'UTTERANCE');

  return (
    <Paper className={classes.nodePaper}>
      <Typography variant={'h6'} className={classes.formControl}>
        {
          edge ?
          `Editing ${edgeType} edge`
          :
          `Add a new ${edgeType} edge`
        }
      </Typography>

      <FormControl component="fieldset" className={classes.formControl} required={true} disabled={!!edge}>
        <FormLabel>Edge Type </FormLabel>
        <RadioGroup name="responseType" defaultValue={edgeType} onChange={(event) => {setEdgeType(event.target.value as GraphEdgeType); }}>
          <FormControlLabel value={'UTTERANCE'} control={<Radio />} label="Utterance Edge" />
          <FormControlLabel value={'CONFIRM'} control={<Radio />} label="Confirm Edge" />
        </RadioGroup>
      </FormControl>
      <UpsertEdgeForm agentId={agentId} edgeId={edgeId} edgeType={edgeType} nodeId={nodeId}
        policy={policy} onSuccess={onSuccess} onCancel={onCancel} />
    </Paper>
  );
}
