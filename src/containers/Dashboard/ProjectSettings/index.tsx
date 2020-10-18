import { useMutation } from '@apollo/client';
import {
  Box,
  Button,
  CircularProgress,
  createStyles,
  Grid,
  IconButton,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { IAPIKey } from '../../../models/user-service';
import { useQueryAsArray } from '../../../utils/hooks';
import KeyValueArrayInput from '../../Utils/KeyValueArrayInput';
import { deleteApiKeyMutation, getApiKeysQuery, updateDomainsMutation } from './gql';
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

interface QueryResult {
  apiKey: IAPIKey;
}

interface UpdateDomainsMutationResult {
  updateAllowedDomains: IAPIKey;
}

export default function Project() {
  const classes = useStyles();
  const { projectId } = useParams();
  const [currentKey, setCurrentKey] = useState<IAPIKey | null>(null);
  const [showCreateKeyDialog, setShowCreateKeyDialog] = useState(false);

  const [apiKey, apiKeyLoading] = useQueryAsArray<QueryResult>(getApiKeysQuery, {
    variables: {
      projectId,
    },
  });

  const [deleteKey, deleteKeyMutation] = useMutation(deleteApiKeyMutation);
  const [updateAllowedDomains, updateAllowedDomainsMutation] = useMutation<UpdateDomainsMutationResult>(updateDomainsMutation);

  const loadedKey = apiKey?.apiKey ?? null;

  useEffect(() => {
    if (!apiKeyLoading) {
      setCurrentKey(loadedKey);
    }
  }, [loadedKey, apiKeyLoading]);

  const deleteApiKey = async () => {
    try {
      await deleteKey({
        variables: {
          projectId,
        },
      });

      setCurrentKey(null);
    } catch (e) {

    }
  };

  const updateDomains = async (e: any) => {
    const domains = e.target.value;

    try {
      const { data } = await updateAllowedDomains({
        variables: {
          projectId,
          domains,
        },
      });

      const updatedKey = data?.updateAllowedDomains ?? null;
      setCurrentKey(updatedKey);
    } catch (e) {

    }
  };

  const loading = apiKeyLoading || deleteKeyMutation.loading;

  return (
    <Box p={3}>
      <Grid container={true} alignItems="center">
        <Grid item={true}>
          <Typography variant="h5">API Keys</Typography>
        </Grid>
        <Grid item={true}>
          <IconButton style={{ marginLeft: 16 }} onClick={() => setShowCreateKeyDialog(true)} disabled={loading}>
            <Add />
          </IconButton>
        </Grid>
      </Grid>
      <NewApiKeyDialog
        isOpen={showCreateKeyDialog}
        onClose={() => setShowCreateKeyDialog(false)}
        onCreateKey={setCurrentKey}
      />
      {(!currentKey && loading) && (
        <Box p={4}>
          <Grid container={true} alignItems="center" justify="center">
            <Grid item={true}>
              <CircularProgress size={18} />
            </Grid>
          </Grid>
        </Box>
      )}
      {currentKey && (
        <Box>
          <Grid container={true} className={classes.keyItem} justify="space-between" alignItems="center">
            <Grid item={true}>
              <Tooltip title="Copy Key" arrow={true}>
                <Typography style={{ cursor: 'pointer' }}>
                  {currentKey.key}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item={true}>
              <Button className={classes.deleteBtn} disabled={loading} onClick={deleteApiKey}>Delete</Button>
            </Grid>
          </Grid>
          <Grid container={true} className={classes.domainsContainer} justify="space-between" alignItems="center">
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
