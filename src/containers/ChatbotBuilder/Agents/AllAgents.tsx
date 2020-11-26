import { useMutation, useQuery } from '@apollo/client';
import { checkNameSchema } from '@bavard/agent-config/dist/utils';
import { Card, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useParams } from 'react-router';
import {
  CHATBOT_CREATE_AGENT,
  CHATBOT_DELETE_AGENT,
  CHATBOT_GET_AGENTS,
} from '../../../common-gql-queries';
import { IAgent } from '../../../models/chatbot-service';
import { IUser } from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import AgentsTable from './AgentsTable';
import NewAgent from './NewAgent';
import { IGetAgents } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '50px',
      overflow: 'auto',
    },
    pageTitle: {
      marginBottom: theme.spacing(2),
    },
    gridRow: {
      marginBottom: theme.spacing(2),
    },
  }),
);

interface IChatbotBuilderAgentProps {
  user: IUser;
}

const AllAgents: React.FC<IChatbotBuilderAgentProps> = ({ user }) => {
  const classes = useStyles();
  const activeWorkspace = user.activeWorkspace;
  const { enqueueSnackbar } = useSnackbar();

  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const agentsData = useQuery<IGetAgents>(CHATBOT_GET_AGENTS, {
    variables: { workspaceId },
  });

  const agents: IAgent[] | undefined =
    agentsData && agentsData.data && agentsData.data.ChatbotService_agents;

  const [
    deleteAgent,
    { loading: deleteAgentLoading, error: deleteAgentError },
  ] = useMutation(CHATBOT_DELETE_AGENT, {
    refetchQueries: [{ query: CHATBOT_GET_AGENTS, variables: { workspaceId } }],
    awaitRefetchQueries: true,
  });

  const [
    createAgent,
    { loading: createAgentLoading, error: createAgentError },
  ] = useMutation(CHATBOT_CREATE_AGENT, {
    refetchQueries: [{ query: CHATBOT_GET_AGENTS, variables: { workspaceId } }],
    awaitRefetchQueries: true,
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: 'error' });
    },
  });

  if (agentsData.loading || createAgentLoading || deleteAgentLoading) {
    return <ContentLoading shrinked={true} />;
  }

  const commonError = agentsData.error
    ? agentsData.error
    : deleteAgentError || createAgentError;
  if (commonError) {
    // TODO: handle errors
    return <ApolloErrorPage error={commonError} />;
  }

  const onDeleteAgent = (agent: IAgent) => {
    deleteAgent({
      variables: {
        agentId: Number(agent.id),
      },
    });
  };

  const onAddAgent = (uname: string) => {
    if (!user.activeWorkspace) {
      return;
    }

    if (agents && agents.some((agent) => agent.uname === uname)) {
      enqueueSnackbar(
        "The agent name must be unique. You can't use that name twice",
        { variant: 'error' },
      );
      return;
    }

    if (!checkNameSchema(uname)) {
      enqueueSnackbar(
        'The name can only contain alphanumeric characters and hyphens, underscores.',
        { variant: 'error' },
      );
      return;
    }

    createAgent({
      variables: {
        workspaceId,
        uname,
      },
    });
  };

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} container={true}>
        <Typography className={classes.pageTitle} variant="h5">
          Assistant Builder
        </Typography>
      </Grid>
      <Grid item={true} container={true}>
        <Grid item={true} xs={12} sm={12} className={classes.gridRow}>
          <NewAgent
            user={user}
            loading={createAgentLoading}
            onAddAgent={onAddAgent}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12}>
          <Card>
            {activeWorkspace && agents && (
              <AgentsTable agents={agents} onDeleteAgent={onDeleteAgent} />
            )}
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AllAgents;
