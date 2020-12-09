import { useMutation } from '@apollo/client';
import { TextInput } from '@bavard/react-components';
import { GraphPolicyV2 } from '@bavard/agent-config/dist/graph-policy-v2';
import { AgentUtteranceNode } from '@bavard/agent-config/dist/graph-policy-v2';
import { Button, FullDialog, RichTextInput } from '@bavard/react-components';
import { FormControl, Grid, Theme, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import ContentLoading from '../../ContentLoading';

import { useSnackbar } from 'notistack';
import { useRecoilState } from 'recoil';
import { CHATBOT_UPDATE_AGENT } from '../../../common-gql-queries';
import { currentAgentConfig } from '../atoms';

import { Alert } from '@material-ui/lab';
import ApolloErrorPage from '../../ApolloErrorPage';

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
  onCancel?: () => void;
}

const CreateGraphPolicyDialog = ({
  open,
  agentId,
  onSuccess,
  onCancel,
}: IProps) => {
  const [agentConfig, setAgentConfig] = useRecoilState(currentAgentConfig);

  const [isOpen, setOpen] = useState(open || false);
  const [policyName, setPolicyName] = useState<string | undefined>();
  const [startUtterance, setStartUtterance] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [updateAgent, updateAgentResult] = useMutation(CHATBOT_UPDATE_AGENT);
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();

  const closeDialog = () => {
    clearForm();
    onCancel?.();
    setOpen(open || false);
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

    agentConfig?.addGraphPolicyV2(policy);

    setAgentConfig(agentConfig);

    const mutationResult = await updateAgent({
      variables: {
        agentId,
        config: agentConfig.toJsonObj(),
      },
    });

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

  if (updateAgentResult.error) {
    return <ApolloErrorPage error={updateAgentResult.error} />;
  }

  return (
    <FullDialog
      isOpen={isOpen}
      title={'Create Graph Policy'}
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
          <TextInput
            onChange={(e) => {
              setPolicyName(e.currentTarget.value);
              onFormChange();
            }}
            size="small"
            className={classes.formControl}
            label="Policy Name"
            labelType="Typography"
            labelPosition="top"
            variant="outlined"
          />

          <FormControl variant="outlined" className={classes.formControl}>
            <RichTextInput
              label="Utterance"
              onChange={(value: string) => {
                setStartUtterance(value);
                onFormChange();
              }}
            />
          </FormControl>

          {error && (
            <Alert className={classes.formControl} severity="error">
              {error}
            </Alert>
          )}
          <Button
            title="Submit"
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={handleSubmit}
          />
          {loading && <ContentLoading />}
        </Grid>
      </Grid>
    </FullDialog>
  );
};

export default CreateGraphPolicyDialog;
