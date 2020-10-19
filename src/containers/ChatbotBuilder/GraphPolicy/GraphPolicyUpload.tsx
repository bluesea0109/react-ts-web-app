import { useMutation } from '@apollo/client';
import {
  GraphPolicy,
  GraphPolicySchema,
  IGraphPolicy,
} from '@bavard/agent-config';
import { Box, Button, TextField, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, useState } from 'react';
import { useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { CHATBOT_UPDATE_AGENT } from '../../../common-gql-queries';
import { currentAgentConfig } from '../atoms';

interface IGraphPolicyUploadProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const GraphPolicyUpload = ({ onSuccess, onError }: IGraphPolicyUploadProps) => {
  const { agentId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const numAgentId = Number(agentId);

  const [config] = useRecoilState(currentAgentConfig);

  const [loading, setLoading] = useState(false);
  const [policy, setPolicy] = useState<IGraphPolicy | undefined>();
  const [policyName, setPolicyName] = useState<string | undefined>();

  const [updateAgent, updateAgentData] = useMutation(CHATBOT_UPDATE_AGENT);

  const handleJsonFile = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);

      const file = e.target?.files?.[0];
      if (!file || file.type !== 'application/json') {
        throw new Error('invalid file');
      }

      const json = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result as string);
        };

        reader.onerror = () => {
          reject(reader.result);
        };

        reader.readAsText(file, 'utf-8');
      });

      try {
        await GraphPolicySchema.validate(JSON.parse(json));
      } catch (e) {
        console.error(e);

        onError?.(e);

        throw new Error('JSON schema doesn\'t match required schema!');
      }

      setPolicy(JSON.parse(json) as IGraphPolicy);
    } catch (e) {
      enqueueSnackbar(`Unable to parse json file: ${e.message}`, {
        variant: 'error',
      });
      onError?.(e);
    } finally {
      setLoading(false);
    }
  };

  const createGraphPolicy = async () => {
    if (!config) {
      return enqueueSnackbar('Agent not selected', { variant: 'error' });
    }

    if (!policy || !policyName || policyName === '') {
      return enqueueSnackbar(
        'Please enter a name and upload a json policy file',
        { variant: 'error' },
      );
    }

    policy.policyName = policyName;
    config.addGraphPolicy(GraphPolicy.fromJsonObj(policy));

    try {
      setLoading(true);
      await updateAgent({
        variables: {
          agentId: numAgentId,
          config: config.toJsonObj(),
        },
      });
      if (updateAgentData.error) {
        throw new Error(updateAgentData.error.message);
      }
      setPolicy(policy);
      enqueueSnackbar('Graph Policy Created Successfully!', {
        variant: 'success',
      });
      onSuccess?.();
    } catch (e) {
      enqueueSnackbar(`Unable to create policy ${JSON.stringify(e)}`, {
        variant: 'error',
      });
      onError?.(e);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = updateAgentData.loading || loading;

  return (
    <Box p={4}>
      <Box my={2}>
        <TextField
          label="Policy Name"
          disabled={isLoading}
          fullWidth={true}
          variant="outlined"
          value={policyName}
          onChange={(e) => setPolicyName(e.target.value as string)}
        />
      </Box>
      <Box mt={5}>
        <Button
          disabled={isLoading}
          variant="contained"
          component="label"
          style={{ padding: 6 }}>
          {'Upload JSON File'}
          <input
            name="json"
            id="json"
            accept="application/JSON"
            type="file"
            style={{ display: 'none' }}
            multiple={false}
            onChange={handleJsonFile}
          />
        </Button>
      </Box>
      <Box mt={5}>
        <Typography>
          {'You may upload graph policy data as a JSON file'}
        </Typography>
      </Box>
      <Box mt={5}>
        <Button
          disabled={isLoading || !config}
          variant="contained"
          color="primary"
          onClick={createGraphPolicy}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default GraphPolicyUpload;
