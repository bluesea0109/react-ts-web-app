import { BaseEdge, ConfirmEdge, GraphPolicy} from '@bavard/graph-policy';
import { FormControl, FormControlLabel, FormLabel,
  Paper, Radio, RadioGroup, Typography} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState} from 'react';
// import UpsertUtteranceEdgeForm from './UpsertEdgeForm';
// import UpsertConfirmEdgeForm from './UpsertConfirmEdgeForm';
// import UpsertEmailEdgeForm from './UpsertEmailEdgeForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fullWidth: {
      width: '100%',
    },
    formControl: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    nodePaper: {
      borderRadius: theme.spacing(1),
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
    },
    optionImage: {
      width: 100,
      height: 100,
      borderRadius: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

interface IUpsertEdgeFormProps {
  agentId: number;
  nodeId: number;
  onCancel: () => void;
  onSuccess: (policy: GraphPolicy) => void;
  policy: GraphPolicy;
  edgeId?: number;
}

export default function UpsertEdgeForm({agentId, nodeId, policy, edgeId , onCancel, onSuccess}: IUpsertEdgeFormProps) {
  const classes = useStyles();
  const node = policy.getNodeById(nodeId);
  let edge: BaseEdge | undefined;
  if (edgeId) {
    edge = node?.getEdgeById(edgeId);
  }

  const [edgeType, setEdgeType] = useState(edge instanceof ConfirmEdge ? 'confirm' : 'utterance');

  // let FormComponent = UpsertUtteranceEdgeForm;

  // switch(edgeType) {
  //   case 'confirm': {
  //     FormComponent = UpsertConfirmEdgeForm;
  //     break;
  //   }
  //   case 'email': {
  //     FormComponent = UpsertEmailEdgeForm;
  //     break;
  //   }
  //   default: {
  //     FormComponent = UpsertUtteranceEdgeForm;
  //     break;
  //   }
  // }

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

      {
        !!!edge &&
        <FormControl component="fieldset" className={classes.formControl} required={true}>
          <FormLabel>Edge Type </FormLabel>
          <RadioGroup name="responseType" defaultValue={edgeType || 'utterance'} onChange={(event) => {setEdgeType(event.target.value); }}>
            <FormControlLabel value={'utterance'} control={<Radio />} label="Utterance Edge" />
            <FormControlLabel value={'confirm'} control={<Radio />} label="Confirm Edge" />
            <FormControlLabel value={'email'} control={<Radio />} label="Email Edge" />
          </RadioGroup>
        </FormControl>
      }
      {
        // <FormComponent agentId={agentId} edgeId={edgeId} nodeId={nodeId}
        //   policy={policy} onSuccess={onSuccess} onCancel={onCancel} />
      }
    </Paper>
  );
}
