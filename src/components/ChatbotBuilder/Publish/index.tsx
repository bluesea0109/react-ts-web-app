import { useMutation, useQuery } from '@apollo/client';
import { Button, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublishedAgentsQuery, publishAgentMutation } from './gql';
import PublishedAgentsTable from './PublishedAgentsTable';
import { IGetPublishedAgentsQueryResult } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
  }),
);

export default function PublishAgent() {
  const classes = useStyles();
  let { agentId } = useParams();
  agentId = parseInt(agentId);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [publishAgent] = useMutation(publishAgentMutation, {
    refetchQueries: [
      { query: getPublishedAgentsQuery, variables: { agentId } },
    ],
    awaitRefetchQueries: true,
  });
  const queryResult = useQuery<IGetPublishedAgentsQueryResult>(
    getPublishedAgentsQuery,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        agentId,
      },
    },
  );

  const handlePublish = async () => {
    setLoading(true);
    try {
      const result = await publishAgent({
        variables: { agentId },
      });
      if (result.errors) {
        throw new Error(JSON.stringify(result.errors));
      }
      enqueueSnackbar('Agent Published');
    } catch (e) {
      enqueueSnackbar(
        `Error in publishing agent - ${JSON.stringify(e).slice(0, 300)}...`,
        {
          variant: 'error',
        },
      );
    }

    setLoading(false);
  };

  const agents = queryResult.data?.ChatbotService_getPublishedAgents;

  return (
    <Grid container={true} spacing={2} className={classes.root}>
      <Grid item={true} xs={12}>
        <PublishedAgentsTable
          publishedAgents={agents}
          loading={queryResult.loading || loading}
          toolbarChildren={
            <Button variant="contained" color="primary" onClick={handlePublish}>
              Publish
            </Button>
          }
        />
      </Grid>
    </Grid>
  );
}
