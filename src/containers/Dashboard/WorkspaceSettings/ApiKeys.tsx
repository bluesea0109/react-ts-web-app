import { useMutation, useQuery } from '@apollo/client';
import { CommonTable, Button } from '@bavard/react-components';
import { Box, CardHeader, Typography } from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import React, { useState } from 'react';

import { IAPIKey } from '../../../models/user-service';
import { deleteApiKeyMutation, getApiKeysQuery } from './gql';
import NewApiKeyDialog from './NewApiKeyDialog';
import UpdateApiKeyDialog from './UpdateApikeyDialog';
import ApolloErrorPage from '../../ApolloErrorPage';

interface IProps {
  workspaceId?: String;
}

export default function Project({ workspaceId }: IProps) {
  const [apiKeys, setAPIKeys] = useState<IAPIKey[]>([]);
  const [currentKey, setCurrentKey] = useState<IAPIKey | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const { error: apiKeysError } = useQuery<any>(getApiKeysQuery, {
    variables: {
      workspaceId,
    },
    onCompleted: (data) => {
      setAPIKeys(data.apiKeys);
    },
  });

  const [deleteKey, apiKeysResponse] = useMutation(deleteApiKeyMutation, {
    variables: {
      workspaceId,
      keyId: Number(currentKey?.id),
    },
    refetchQueries: [
      {
        query: getApiKeysQuery,
        variables: { workspaceId },
      },
    ],
  });

  const deleteApiKey = (apiKey: IAPIKey) => {
    try {
      setCurrentKey(apiKey);
      deleteKey({
        variables: {
          workspaceId,
          keyId: Number(apiKey.id),
        },
      });

      const filteredApiKeys = apiKeys.filter((apiKey) => {
        return Number(apiKey.id) !== Number(currentKey?.id);
      });

      setAPIKeys(filteredApiKeys);
      setCurrentKey(null);
    } catch (e) {}
  };

  const columns = [
    { title: 'API Key', field: 'key' },
    {
      title: 'Domains',
      field: 'domains',
      renderRow: (rowData: IAPIKey) => rowData.domains.join(', '),
    },
  ];

  const handleToggleCreateDialog = () => {
    setShowCreateDialog(!showCreateDialog);
  };

  const handleShowUpdateDialog = (key: IAPIKey) => {
    setCurrentKey(key);
    setShowUpdateDialog(!showUpdateDialog);
  };

  const handleCloseUpdateDialog = () => {
    setShowUpdateDialog(!showUpdateDialog);
  };

  const handleUpdateApiKey = (key: IAPIKey | null) => {
    const updatedApiKeys = apiKeys.map((apiKey) => {
      if (apiKey.key === key?.key) {
        return Object.assign({}, apiKey, key);
      } else {
        return apiKey;
      }
    });

    setCurrentKey(key);
    setAPIKeys(updatedApiKeys);
  };

  const error = apiKeysError || apiKeysResponse.error;
  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  return (
    <Box width={1} mx={1} mt={2}>
      <NewApiKeyDialog
        isOpen={showCreateDialog}
        workspaceId={workspaceId}
        onClose={handleToggleCreateDialog}
        apiKeys={apiKeys}
        onCreateKey={setAPIKeys}
      />
      <CommonTable
        data={{
          columns,
          rowsData: apiKeys,
        }}
        eventHandlers={{
          onRowClick: (rowData: IAPIKey) => {
            setCurrentKey(rowData);
          },
        }}
        editable={{
          isDeleteable: true,
          isEditable: true,
          onRowDelete: (rowData: IAPIKey) => {
            deleteApiKey(rowData);
          },
          onRowEdit: (rowData: IAPIKey) => {
            handleShowUpdateDialog(rowData);
          },
        }}
        components={{
          Toolbar: () => (
            <CardHeader
              avatar={<VpnKeyIcon />}
              title={<Typography variant="h6">API Keys</Typography>}
              action={
                <Button
                  color="primary"
                  title="Create a new key"
                  variant="text"
                  RightIcon={AddCircleOutlineIcon}
                  onClick={handleToggleCreateDialog}
                />
              }
            />
          ),
        }}
      />
      {currentKey && (
        <UpdateApiKeyDialog
          isOpen={showUpdateDialog}
          workspaceId={workspaceId}
          currentKey={currentKey}
          onUpdate={handleUpdateApiKey}
          onClose={handleCloseUpdateDialog}
        />
      )}
    </Box>
  );
}
