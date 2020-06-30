import { useMutation, useQuery } from '@apollo/react-hooks';
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

import { createApiKeyMutation, deleteApiKeyMutation, getApiKeysQuery } from './gql';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    keyItem: {
      margin: theme.spacing(2, 0),
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
  const { projectId } = useParams();
  const [currentKey, setCurrentKey] = useState<string | null>(null);

  const apiKeysQuery = useQuery(getApiKeysQuery, {
    variables: {
      projectId,
    },
  });

  const [addKey, createKeyMutation] = useMutation(createApiKeyMutation);
  const [deleteKey, deleteKeyMutation] = useMutation(deleteApiKeyMutation);

  const loadedKey = apiKeysQuery.data?.apiKey.key ?? null;

  useEffect(() => {
    if (!apiKeysQuery.loading) {
      setCurrentKey(loadedKey);
    }
  }, [loadedKey, apiKeysQuery.loading]);

  const createNewKey = async () => {
    try {
      const { data } = await addKey({
        variables: {
          projectId,
        },
      });

      setCurrentKey(data?.generateApiKey?.key ?? null);
    } catch (e) {

    }
  };

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

  const loading = apiKeysQuery.loading || createKeyMutation.loading || deleteKeyMutation.loading;

  return (
    <Box p={3}>
      <Grid container={true} alignItems="center">
        <Grid item={true}>
          <Typography variant="h5">API Keys</Typography>
        </Grid>
        <Grid item={true}>
          <IconButton style={{ marginLeft: 16 }} onClick={createNewKey} disabled={loading}>
            <Add />
          </IconButton>
        </Grid>
      </Grid>
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
        <Grid container={true} className={classes.keyItem} justify="space-between" alignItems="center">
          <Grid item={true}>
            <Tooltip title="Copy Key" arrow={true}>
              <Typography style={{ cursor: 'pointer' }}>
                {currentKey}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item={true}>
            <Button className={classes.deleteBtn} disabled={loading} onClick={deleteApiKey}>Delete</Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
