import { EmailNode, UtteranceNode } from '@bavard/graph-policy';
import { FormControl, FormControlLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useEffect, useState} from 'react';
import {validateEmail} from '../../../utils/string';

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

interface ICreateNodeFormProps {
  onChange: (node: UtteranceNode | EmailNode | undefined) => void;
  nodeId: number;
}

export default function CreateNodeForm({ nodeId, onChange}: ICreateNodeFormProps) {
  const classes = useStyles();
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [utterance, setUtterance] = useState('');
  const [nodeType, setNodeType] = useState<string>('UtteranceNode');
  const [senderEmail, setSenderEmail] = useState('');
  const [actionName, setActionName] = useState('');

  const handleUtteranceNode = async() => {
    const newNode = new UtteranceNode(nodeId, actionName, utterance);
    onChange(newNode);
  };

  const handleEmailNode = async() => {
    if (!validateEmail(senderEmail)) {
      return;
    }
    const newNode = new EmailNode(nodeId, actionName, senderEmail, utterance);
    onChange(newNode);
  };

  const handleChange = () => {
    setShowFormErrors(true);

    // Preliminary validation
    if (!utterance || !actionName || !nodeId) {
      return;
    }

    if (nodeType === UtteranceNode.typename) {
      handleUtteranceNode();
    } else if (nodeType === EmailNode.typename) {
      handleEmailNode();
    }
  };

  useEffect(handleChange, [senderEmail, actionName, utterance]);

  return (
    <div>
      <RadioGroup name="responseType" defaultValue={nodeType || UtteranceNode.typename}
        onChange={(event) => {setNodeType(event.target.value); }}>
        <FormControlLabel value={UtteranceNode.typename} control={<Radio />} label="Utterance Node" />
        <FormControlLabel value={EmailNode.typename} control={<Radio />} label="Email Node" />
      </RadioGroup>
      <FormControl variant="outlined" className={classes.formControl}>
        <TextField name="actionName" error={showFormErrors && actionName === ''}
          required={true} label="Action Name" variant="outlined"
          onChange={(e) => setActionName(e.target.value as string)} />
      </FormControl>
      {
        nodeType === EmailNode.typename &&
        <FormControl variant="outlined"  className={classes.formControl} >
          <TextField name="senderEmail" error={showFormErrors && !validateEmail(senderEmail)}
            required={true} label="Sender Email" variant="outlined"
            onChange={(e) => setSenderEmail(e.target.value as string)} />
        </FormControl>
      }

      <FormControl variant="outlined"  className={classes.formControl} >
        <TextField name="utterance" error={showFormErrors && utterance === ''}
          required={true} label="Utterance" variant="outlined"
          onChange={(e) => setUtterance(e.target.value as string)} />
      </FormControl>
    </div>
  );
}
