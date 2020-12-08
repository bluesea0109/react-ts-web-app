import { useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from '@material-ui/core';
import { Button } from '@bavard/react-components';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CHATBOT_GET_AGENT } from '../../../common-gql-queries';
import { IAgent } from '../../../models/chatbot-service';
import { getApiKeysQuery } from '../../Dashboard/WorkspaceSettings/gql';
import { getPublishedAgentsQuery, publishAgentMutation } from './gql';
import PublishedAgentsTable from './PublishedAgentsTable';
import { IGetPublishedAgentsQueryResult } from './types';

import AgentEmbedCode from './AgentEmbedCode';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: '#eaeaea',
      height: '100vh',
      padding: theme.spacing(6),
    },
    subContainer: {
      marginBottom: theme.spacing(4),
    },
    cardContainer: {
      width: '100%',
    },
    embedCodeContainer: {
      backgroundColor: theme.palette.info.light,
    },
  }),
);

export default function PublishAgent() {
  const classes = useStyles();
  const params = useParams<{ agentId: string; workspaceId: string }>();
  const agentId = parseInt(params.agentId, 10);

  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    loading: false,
    modalOpen: false,
    forceRetrain: false,
  });
  const apiKeyQueryResult = useQuery(getApiKeysQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      workspaceId: params.workspaceId,
    },
  });

  const agentQueryResult = useQuery<{ ChatbotService_agent: IAgent }>(
    CHATBOT_GET_AGENT,
    { variables: { agentId } },
  );

  const agentUname = agentQueryResult.data?.ChatbotService_agent.uname;

  const [publishAgent] = useMutation(publishAgentMutation, {
    refetchQueries: [
      {
        query: getPublishedAgentsQuery,
        variables: { agentId, forceRetrain: state.forceRetrain },
      },
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

  const handlePublish = () => {
    setState((prevState) => ({ ...prevState, modalOpen: true }));
  };

  const handleConfirm = async () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
      modalOpen: false,
    }));
    try {
      const result = await publishAgent({
        variables: { agentId, forceRetrain: state.forceRetrain },
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

    setState((prevState) => ({ ...prevState, loading: false }));
  };

  const handleCancel = () => {
    setState((prevState) => ({ ...prevState, modalOpen: false }));
  };

  const handleCloseDialogue = () => {
    setState((prevState) => ({ ...prevState, modalOpen: false }));
  };

  const toggleForceRetrain = () => {
    setState((prevState) => ({
      ...prevState,
      forceRetrain: !prevState.forceRetrain,
    }));
  };
  const agents = queryResult.data?.ChatbotService_getPublishedAgents;

  return (
    <Grid container={true} className={classes.root}>
      <Grid
        item={true}
        container={true}
        xs={12}
        className={classes.subContainer}>
        <PublishedAgentsTable
          publishedAgents={agents}
          loading={queryResult.loading || state.loading}
          toolbarChildren={
            <Button
              title="Publish Assistant"
              variant="contained"
              color="primary"
              onClick={handlePublish}
            />
          }
        />
      </Grid>

      <Grid
        item={true}
        container={true}
        xs={12}
        className={classes.subContainer}>
        <Card className={classes.cardContainer}>
          <CardHeader
            title={<Typography variant="h6">Embed Code</Typography>}
            subheader="Copy and paste this code snippet to embed the bot within your HTML"
          />
          <CardContent>
            <Box className={classes.embedCodeContainer}>
              <AgentEmbedCode
                agentUname={agentUname || '<your-agent-uname>'}
                apiKey={apiKeyQueryResult.data?.apiKey?.key || '<your-api-key>'}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Dialog
        open={state.modalOpen}
        onClose={handleCloseDialogue}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {'Do you want to publish?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {'Force re-train NLP models:'}
            <Checkbox
              checked={state.forceRetrain}
              onChange={toggleForceRetrain}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button title="Confirm" onClick={handleConfirm} color="primary" />
          <Button
            title="Cancel"
            onClick={handleCancel}
            color="primary"
            autoFocus={true}
          />
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
