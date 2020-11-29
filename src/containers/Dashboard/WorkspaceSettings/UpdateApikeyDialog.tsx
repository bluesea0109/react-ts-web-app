import { useMutation } from '@apollo/client';
import { ActionDialog, KeyValueArrayInput } from '@bavard/react-components';
import { Box, DialogTitle, Typography } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router';
import { IAPIKey } from '../../../models/user-service';
import { getApiKeysQuery, updateDomainsMutation } from './gql';

interface UpdateApiKeyDialogProps {
  isOpen: boolean;
  currentKey: IAPIKey;
  onClose: () => void;
  onUpdate: (key: IAPIKey | null) => void;
}

interface UpdateDomainsMutationResult {
  updateAllowedDomains: IAPIKey;
}

const UpdateApiKeyDialog: React.FC<UpdateApiKeyDialogProps> = ({
  isOpen,
  currentKey,
  onClose,
  onUpdate: handleUpdateApiKey,
}) => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const [
    updateAllowedDomains,
    updateAllowedDomainsMutation,
  ] = useMutation<UpdateDomainsMutationResult>(updateDomainsMutation, {
    refetchQueries: [{ query: getApiKeysQuery, variables: { workspaceId } }],
  });

  const updateDomains = async (e: any) => {
    const domains = e.target.value;

    try {
      const { data } = await updateAllowedDomains({
        variables: {
          keyId: Number(currentKey?.id),
          domains,
        },
      });

      const updatedKey = data?.updateAllowedDomains ?? null;
      handleUpdateApiKey(updatedKey);
    } catch (e) {}
  };

  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="form-dialog-title">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width={500}
        p={3}>
        <Box width={1} mb={3}>
          <Typography variant="h5" align="center">
            {`API Key: ${currentKey?.key}`}
          </Typography>
        </Box>
        <KeyValueArrayInput
          disabled={updateAllowedDomainsMutation.loading}
          name="domains"
          label="Domains"
          value={currentKey?.domains}
          onChange={updateDomains}
        />
      </Box>
    </ActionDialog>
  );
};

export default UpdateApiKeyDialog;
