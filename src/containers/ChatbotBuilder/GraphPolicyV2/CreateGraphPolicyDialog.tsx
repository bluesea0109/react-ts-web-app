import { useMutation } from '@apollo/client';
import { GraphPolicyV2 } from '@bavard/agent-config/dist/graph-policy-v2';
import { AgentUtteranceNode } from '@bavard/agent-config/dist/graph-policy-v2';
import { Button, Grid, TextField, Theme, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import FullScreenDialog from '../../../components/FullScreenDialog';
import ContentLoading from '../../ContentLoading';

import { useSnackbar } from 'notistack';
import { useRecoilState } from 'recoil';
import { CHATBOT_UPDATE_AGENT } from '../../../common-gql-queries';
import { currentAgentConfig } from '../atoms';

import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    gridContainer: {
      height: '100%',
    },
  }),
);

interface IProps {
  agentId: number;
  open?: boolean;
  onSuccess?: (policy: GraphPolicyV2) => void;
}

const CreateGraphPolicyDialog = ({ open, agentId, onSuccess }: IProps) => {
  const [agentConfig, setAgentConfig] = useRecoilState(currentAgentConfig);

  const [isOpen, setOpen] = useState(open || false);
  const [policyName, setPolicyName] = useState<string | undefined>();
  const [startUtterance, setStartUtterance] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [updateAgent] = useMutation(CHATBOT_UPDATE_AGENT);
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();

  const closeDialog = () => {
    clearForm();
    setOpen(false);
  };

  const onFormChange = () => {
    setError(undefined);
  };

  if (!agentConfig) {
    return <></>;
  }

  const clearForm = () => {
    setPolicyName('');
    setStartUtterance('');
  };

  const handleSubmit = async () => {
    console.log({ policyName, startUtterance });

    if (!policyName || !startUtterance) {
      return setError('Policy Name and Start Node Utterance are required');
    }

    setLoading(true);
    const startNode = new AgentUtteranceNode(1, startUtterance);
    const policy = new GraphPolicyV2(
      policyName,
      startNode,
      new Set([startNode]),
    );
    console.log('POLICY: ', policy);

    agentConfig?.addGraphPolicyV2(policy);

    console.log('AGENT CONFIG: ', agentConfig);
    console.log('AGENT CONFIG JSON: ', agentConfig.toJsonObj());

    setAgentConfig(agentConfig);

    const mutationResult = await updateAgent({
      variables: {
        agentId,
        config: agentConfig.toJsonObj(),
      },
    });

    console.log('mutation result: ', mutationResult);

    setLoading(false);

    if (mutationResult.errors?.length) {
      return enqueueSnackbar(JSON.stringify(mutationResult.errors), {
        variant: 'error',
      });
    }

    enqueueSnackbar('Policy Created', {
      variant: 'success',
    });

    onSuccess?.(policy);
  };

  return (
    <FullScreenDialog
      title={'Create Graph Policy'}
      open={isOpen}
      onClose={closeDialog}>
      <Grid
        container={true}
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.gridContainer}>
        <Grid item={true} xs={12} md={4}>
          <Typography className={classes.formControl}>
            Create a new graph policy
          </Typography>
          <TextField
            onChange={(e) => {
              setPolicyName(e.currentTarget.value);
              onFormChange();
            }}
            size="small"
            className={classes.formControl}
            label="Policy Name"
            variant="outlined"
          />
          <TextField
            onChange={(e) => {
              setStartUtterance(e.currentTarget.value);
              onFormChange();
            }}
            size="small"
            className={classes.formControl}
            label="Start Node Utterance"
            variant="outlined"
          />
          {error && (
            <Alert className={classes.formControl} severity="error">
              {error}
            </Alert>
          )}
          <Button
            disabled={loading}
            variant="contained"
            color="primary"
            onClick={handleSubmit}>
            Submit
          </Button>
          {loading && <ContentLoading />}
        </Grid>
      </Grid>
    </FullScreenDialog>
  );
};

export default CreateGraphPolicyDialog;
