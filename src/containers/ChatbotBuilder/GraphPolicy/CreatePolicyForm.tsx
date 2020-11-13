import { useMutation } from '@apollo/client';
import { GraphPolicy, UtteranceNode } from '@bavard/agent-config';
import {
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentAgentConfig } from '../atoms';

import { useParams } from 'react-router-dom';
import { CHATBOT_UPDATE_AGENT } from '../../../common-gql-queries';
import RichTextInput from '../../../components/RichTextInput';
import ContentLoading from '../../ContentLoading';

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

interface ICreatePolicyFormProps {
  onSuccess?: (policy: GraphPolicy) => void;
}

export default function CreatePolicyForm({
  onSuccess,
}: ICreatePolicyFormProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [utterance, setUtterance] = useState('');
  const [policyName, setPolicyName] = useState('');
  const [actionName, setActionName] = useState('');
  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);
  const [config, setConfig] = useRecoilState(currentAgentConfig);
  const [updateAgent] = useMutation(CHATBOT_UPDATE_AGENT);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (policyName === '' || actionName === '' || utterance === '' || !config) {
      return enqueueSnackbar('Please fill out all the fields', {
        variant: 'error',
      });
    }
    setLoading(true);

    const rootNode = new UtteranceNode(1, actionName, utterance);
    const policy = new GraphPolicy(policyName, rootNode);
    policy.addIntent('default');

    await config.addGraphPolicy(policy);

    setConfig(config);

    const mutationResult = await updateAgent({
      variables: {
        agentId,
        config: config.toJsonObj(),
      },
    });

    setLoading(false);

    if (mutationResult.errors?.length) {
      return enqueueSnackbar(JSON.stringify(mutationResult.errors), {
        variant: 'error',
      });
    }

    clearForm();
    enqueueSnackbar('Policy Created', {
      variant: 'success',
    });
    onSuccess?.(policy);
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
        <TextField
          disabled={loading}
          name="policyName"
          label="Policy Name"
          variant="outlined"
          onChange={(e) => setPolicyName(e.target.value as string)}
        />
      </FormControl>

      <Typography variant={'subtitle2'}>Root Node</Typography>
      <FormControl variant="outlined" className={classes.formControl}>
        <TextField
          disabled={loading}
          name="actionName"
          label="Action Name"
          variant="outlined"
          onChange={(e) => setActionName(e.target.value as string)}
        />
      </FormControl>
      <FormControl variant="outlined" className={classes.formControl}>
        <RichTextInput
          label="Utterance"
          value={utterance}
          disabled={loading}
          onChange={(value: string) => setUtterance(value)}
        />
      </FormControl>
      <Button
        variant="contained"
        disabled={loading}
        color="primary"
        type="submit"
        onClick={handleSubmit}>
        Save
      </Button>
      {loading && <ContentLoading />}
    </Paper>
  );
}
