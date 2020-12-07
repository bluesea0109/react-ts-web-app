import { useMutation, useQuery } from '@apollo/client';
import { CommonTable, Button } from '@bavard/react-components';
import {
  Box,
  CardHeader,
  createStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import React, { useState } from 'react';
import { useParams } from 'react-router';

import { IAPIKey } from '../../../models/user-service';
import { deleteApiKeyMutation, getApiKeysQuery } from './gql';
import NewApiKeyDialog from './NewApiKeyDialog';
import UpdateApiKeyDialog from './UpdateApikeyDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    keyItem: {
      margin: theme.spacing(2, 0),
    },
    domainsContainer: {
      margin: theme.spacing(2, 0),
      maxWidth: 800,
    },
    deleteBtn: {
      background: theme.palette.error.main,
      color: '#fff',

      '&:hover': {
        background: theme.palette.error.light,
      },
    },
  }),
);

export default function Project() {
  const classes = useStyles();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [apiKeys, setAPIKeys] = useState<IAPIKey[]>([]);
  const [currentKey, setCurrentKey] = useState<IAPIKey | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const { loading } = useQuery<any>(getApiKeysQuery, {
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

      const temp = apiKeys.filter((apiKey) => {
        return Number(apiKey.id) !== Number(currentKey?.id);
      });

      setAPIKeys(temp);
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
    const temp = apiKeys.map((apiKey) => {
      if (apiKey.key === key?.key) {
        return Object.assign({}, apiKey, key);
      } else {
        return apiKey;
      }
    });

    setCurrentKey(key);
    setAPIKeys(temp);
  };

  return (
    <Box width={1} mx={1} mt={2}>
      <NewApiKeyDialog
        isOpen={showCreateDialog}
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
          currentKey={currentKey}
          onUpdate={handleUpdateApiKey}
          onClose={handleCloseUpdateDialog}
        />
      )}
    </Box>
  );
}
