import { useMutation } from '@apollo/react-hooks';
import { GraphPolicySchema } from '@bavard/graph-policy';
import { Box, Button, TextField, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, useState } from 'react';
import { useParams } from 'react-router';
import { createGraphPolicyMutation } from './gql';

interface IGraphPolicyUploadProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const GraphPolicyUpload = ({onSuccess, onError}: IGraphPolicyUploadProps) => {
  const { agentId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const numAgentId = Number(agentId);

  const [loading, setLoading] = useState(false);
  const [policy, setPolicy] = useState({
    name: '',
    data: null as any,
  });

  const [createPolicy, createGraphPolicyMutationData] = useMutation(createGraphPolicyMutation);

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
        await GraphPolicySchema.validate(json);
      } catch (e) {
        console.log(e);
        if (onError) {
          onError(e);
        }
        throw new Error('JSON schema doesn\'t match required schema!');
      }

      setPolicy({
        ...policy,
        data: JSON.parse(json),
      });
    } catch (e) {
      enqueueSnackbar(`Unable to parse json file: ${e.message}`, { variant: 'error' });
      if (onError) {
        onError(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const createGraphPolicy = async () => {
    try {
      setLoading(true);
      await createPolicy({
        variables: {
          agentId: numAgentId,
          policy,
        },
      });
      setPolicy({
        name: '',
        data: null,
      });
      enqueueSnackbar('Graph Policy Created Successfully!', { variant: 'success' });
      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      enqueueSnackbar('Unable to create policy', { variant: 'error' });
      if (onError) {
        onError(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const isLoading = createGraphPolicyMutationData.loading || loading;

  return (
    <Box p={4}>
      <Box my={2}>
        <TextField
          label="Policy Name"
          disabled={isLoading}
          fullWidth={true}
          variant="outlined"
          value={policy.name}
          onChange={e => setPolicy({ ...policy, name: e.target.value })}
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
        <Typography>{'You may upload graph policy data as a JSON file'}</Typography>
      </Box>
      <Box mt={5}>
        <Button disabled={isLoading} variant="contained" color="primary" onClick={createGraphPolicy}>Submit</Button>
      </Box>
    </Box>
  );
};

export default GraphPolicyUpload;
