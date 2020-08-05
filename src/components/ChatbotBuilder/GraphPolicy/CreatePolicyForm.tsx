import { useMutation } from '@apollo/client';
import {GraphPolicy, UtteranceNode} from '@bavard/graph-policy';
import { Button, FormControl, Paper,  TextField, Typography} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {IAgentGraphPolicy} from '../../../models/chatbot-service';
import ContentLoading from '../../ContentLoading';
import { createGraphPolicyMutation } from './gql';
import { ICreateGraphPolicyMutationResult } from './types';

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
      margin: theme.spacing(1),
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
    },
  }),
);

interface IGraphNodeProps {
  onSuccess?: (policy: IAgentGraphPolicy) => void;
}

export default function CreatePolicyForm({onSuccess}: IGraphNodeProps) {
  const classes = useStyles();
  const {enqueueSnackbar} = useSnackbar();
  let {agentId} = useParams();
  agentId = parseInt(agentId);

  const [utterance, setUtterance] = useState('');
  const [policyName, setPolicyName] = useState('');
  const [actionName, setActionName] = useState('');
  const [createPolicy, mutationData] = useMutation<ICreateGraphPolicyMutationResult>(createGraphPolicyMutation);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async() => {

    if (!agentId || policyName === '' || actionName === '' || utterance === '') {
      return enqueueSnackbar('Please fill out all the fields', { variant: 'error' });
    }

    const rootNode = new UtteranceNode(1, actionName, utterance);
    const policy = new GraphPolicy(rootNode);

    const policyData = policy.toJsonObj();
    policyData.intents.push('default');

    const variables =  {
      agentId,
      policy: {
        name: policyName,
        data: policyData,
      },
    };

    try {
      setLoading(true);
      const result = await createPolicy({ variables });
      enqueueSnackbar('New Policy Created', { variant: 'success' });
      clearForm();
      if (result.data?.ChatbotService_createGraphPolicy) {
        onSuccess?.(result.data.ChatbotService_createGraphPolicy);
      }

    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    }
    setLoading(false);
  };

  const clearForm = () => {
    setUtterance('');
    setActionName('');
    setPolicyName('');
  };

  return (
    <Paper className={classes.nodePaper}>
      <Typography variant={'h6'}>Create Policy</Typography>
      <FormControl variant="outlined" className={classes.formControl}>
        <TextField disabled={loading || mutationData.loading}
          name="policyName" label="Policy Name"
          variant="outlined"
          onChange={(e) => setPolicyName(e.target.value as string)} />
      </FormControl>

      <Typography variant={'subtitle2'}>Root Node</Typography>
      <FormControl variant="outlined" className={classes.formControl}>
        <TextField disabled={loading || mutationData.loading}
          name="actionName" label="Action Name" variant="outlined"
          onChange={(e) => setActionName(e.target.value as string)} />
      </FormControl>
      <FormControl variant="outlined" className={classes.formControl}>
        <TextField disabled={loading || mutationData.loading}
          name="utterance" label="Utterance" variant="outlined"
          onChange={(e) => setUtterance(e.target.value as string)} />
      </FormControl>
      <Button variant="contained" disabled={loading || mutationData.loading}
        color="primary" type="submit" onClick={handleSubmit}>Save</Button>
      {(loading || mutationData.loading) && <ContentLoading/>}
    </Paper>
  );
}
