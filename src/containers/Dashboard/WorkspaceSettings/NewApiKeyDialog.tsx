import { useMutation } from '@apollo/client';
import { ActionDialog } from '@bavard/react-components';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { IAPIKey } from '../../../models/user-service';
import { createApiKeyMutation, getApiKeysQuery } from './gql';

interface NewApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateKey: (key: IAPIKey) => void;
}

interface CreateApiKeyMutationResult {
  generateApiKey: IAPIKey;
}

const NewApiKeyDialog = ({
  isOpen,
  onClose,
  onCreateKey,
}: NewApiKeyDialogProps) => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [apiKey, setApiKey] = useState('');
  const [
    createKey,
    { loading, error },
  ] = useMutation<CreateApiKeyMutationResult>(createApiKeyMutation, {
    refetchQueries: [
      {
        query: getApiKeysQuery,
        variables: { workspaceId },
      },
    ],
  });

  const createAPIKey = async () => {
    let key: string | null = apiKey;
    if (!key || key === '') {
      key = null;
    }

    try {
      const data = await createKey({
        variables: {
          workspaceId,
          apiKey: key,
        },
      });

      if (data.data) {
        onCreateKey(data.data.generateApiKey);
        onClose();
      }
    } catch (e) {}
  };

  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create API Key</DialogTitle>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width={500}
        p={1}>
        <DialogContent>
          <DialogContentText>
            Create your own API key or leave it blank to generate a random key.
          </DialogContentText>
          <Box py={2}>
            <TextField
              label={''}
              disabled={loading}
              fullWidth={true}
              multiline={true}
              variant="outlined"
              rows={1}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Key"
              error={!!error}
            />
            <Box mt={1}>
              <Typography
                variant="caption"
                color={error ? 'error' : 'primary'}
                style={{ textTransform: 'capitalize' }}>
                {!!error && error?.message.replace('GraphQL error: ', '')}
                {!error &&
                  'API Keys must be between 8 to 32 characters long and can only contain alphanumeric characters'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          {!loading && (
            <Button disabled={loading} onClick={createAPIKey} color="primary">
              Create
            </Button>
          )}
          {loading && <CircularProgress size={20} color="primary" />}
        </DialogActions>
      </Box>
    </ActionDialog>
  );
};

export default NewApiKeyDialog;
