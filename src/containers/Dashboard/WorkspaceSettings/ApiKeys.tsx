import { useMutation, useQuery } from '@apollo/client';
import { CommonTable, KeyValueArrayInput } from '@bavard/react-components';
import {
  Box,
  createStyles,
  Grid,
  IconButton,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import React, { useState } from 'react';
import { useParams } from 'react-router';

import { IAPIKey } from '../../../models/user-service';
import {
  deleteApiKeyMutation,
  getApiKeysQuery,
  updateDomainsMutation,
} from './gql';
import NewApiKeyDialog from './NewApiKeyDialog';

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

interface UpdateDomainsMutationResult {
  updateAllowedDomains: IAPIKey;
}

export default function Project() {
  const classes = useStyles();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [apiKeys, setAPIKeys] = useState<IAPIKey[]>([]);
  const [currentKey, setCurrentKey] = useState<IAPIKey | null>(null);
  const [showCreateKeyDialog, setShowCreateKeyDialog] = useState(false);

  const { loading } = useQuery<any>(getApiKeysQuery, {
    variables: {
      workspaceId,
    },
    onCompleted: (data) => {
      setAPIKeys(data.apiKeys);
    },
  });

  const [deleteKey] = useMutation(deleteApiKeyMutation, {
    refetchQueries: [{ query: getApiKeysQuery, variables: { workspaceId } }],
  });
  const [
    updateAllowedDomains,
    updateAllowedDomainsMutation,
  ] = useMutation<UpdateDomainsMutationResult>(updateDomainsMutation, {
    refetchQueries: [{ query: getApiKeysQuery, variables: { workspaceId } }],
  });

  const deleteApiKey = async (apiKey: IAPIKey) => {
    try {
      await deleteKey({
        variables: {
          keyId: Number(apiKey.id),
        },
      });

      setCurrentKey(null);
    } catch (e) {}
  };

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
      setCurrentKey(updatedKey);
    } catch (e) {}
  };

  const columns = [
    { title: 'API Key', field: 'key' },
    {
      title: 'Domain',
      field: 'domains',
      renderRow: (rowData: IAPIKey) => rowData.domains.join(', '),
    },
  ];

  return (
    <Box width={1} mx={1}>
      <Grid container={true} alignItems="center">
        <Grid item={true}>
          <Typography style={{ fontSize: '26px' }}>API Keys</Typography>
        </Grid>
        <Grid item={true}>
          <IconButton
            style={{ marginLeft: 16 }}
            onClick={() => setShowCreateKeyDialog(true)}
            disabled={loading}>
            <Add />
          </IconButton>
        </Grid>
      </Grid>
      <NewApiKeyDialog
        isOpen={showCreateKeyDialog}
        onClose={() => setShowCreateKeyDialog(false)}
        onCreateKey={setCurrentKey}
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
          onRowDelete: (rowData: IAPIKey) => {
            deleteApiKey(rowData);
          },
        }}
      />
      {currentKey && (
        <Box width={1}>
          <Grid
            item={true}
            container={true}
            className={classes.domainsContainer}
            justify="space-between"
            alignItems="center">
            <KeyValueArrayInput
              disabled={updateAllowedDomainsMutation.loading}
              name="domains"
              label="Allowed Domains"
              value={currentKey?.domains}
              onChange={updateDomains}
            />
          </Grid>
        </Box>
      )}
    </Box>
  );
}
