import { Box, Button, createStyles, Grid, IconButton, Theme, Tooltip, Typography } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { createApiKeyMutation, deleteApiKeyMutation, getApiKeysQuery } from './gql';
import { useParams } from 'react-router';

type APIKey = {
  key: string;
  orgId: string;
  projectId: string;
  orgName: string;
  projectName: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    keyItem: {
      margin: theme.spacing(2, 0)
    },
    deleteBtn: {
      background: theme.palette.error.main,
      color: '#fff',

      "&:hover": {
        background: theme.palette.error.light
      }
    }
  })
)

export default function Project() {
  const client = useApolloClient();
  const [apiKeys, setApiKeys] = React.useState<APIKey[]>([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const projectId = useRef<string>("");
  const params = useParams();

  useEffect(() => {
    setLoading(true);
    projectId.current = (params as any).projectId;
    (async () => {
      try {
        const res = await client.query({
          query: getApiKeysQuery,
          variables: {
            projectId: projectId.current
          }
        });

        const apiKeys = [{ ...res.data.apiKey }];
        setApiKeys([ ...apiKeys ]);
      } catch (e) {
        console.log(e.data);
      } finally {
        setLoading(false);
      }
    })()
  }, [params]);

  const createNewKey = async () => {
    setLoading(true);

    try {
      const resp = await client.mutate({
        mutation: createApiKeyMutation,
        variables: {
          projectId: projectId.current
        }
      });

      const apiKeys = [{ ...resp.data.generateApiKey }];
      setApiKeys([ ...apiKeys ]);
    } catch (e) {

    } finally {
      setLoading(false);
    }
  }

  const deleteKey = async () => {
    setLoading(true);

    try {
      await client.mutate({
        mutation: deleteApiKeyMutation,
        variables: {
          projectId: projectId.current
        }
      });

      setApiKeys([]);
    } catch (e) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <Box p={3}>
      <Grid container alignItems="center">
        <Grid item>
          <Typography variant="h5">API Keys</Typography>
        </Grid>
        <Grid item>
          <IconButton style={{ marginLeft: 16 }} onClick={createNewKey} disabled={apiKeys.length >= 1 || loading}>
            <Add />
          </IconButton>
        </Grid>
      </Grid>
      {apiKeys.map(({ key }) => (
        <Grid container key={key} className={classes.keyItem} justify="space-between" alignItems="center">
          <Grid item>
            <Tooltip title="Copy Key" arrow>
              <Typography style={{ cursor: 'pointer' }}>
                {/*{key.split('').slice(0, 3)}*******************/}
                {key}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item>
            <Button className={classes.deleteBtn} disabled={loading} onClick={deleteKey}>Delete</Button>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
}
