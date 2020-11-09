import { useMutation, useQuery } from '@apollo/client';
import { Grid } from '@material-ui/core';
import 'firebase/auth';
import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import {
  CHATBOT_DELETE_AGENT,
  CHATBOT_GET_AGENTS,
} from '../../../common-gql-queries';
import { CommonTable } from '../../../components';
import { IAgent } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';

interface IGetAgents {
  ChatbotService_agents: IAgent[] | undefined;
}

function AgentsTable() {
  const { projectId, orgId } = useParams<{
    projectId: string;
    orgId: string;
  }>();

  const agentsData = useQuery<IGetAgents>(CHATBOT_GET_AGENTS, {
    variables: { projectId },
  });
  const [deleteAgent, { loading, error }] = useMutation(CHATBOT_DELETE_AGENT, {
    refetchQueries: [{ query: CHATBOT_GET_AGENTS, variables: { projectId } }],
    awaitRefetchQueries: true,
  });

  const agents: IAgent[] | undefined =
    agentsData && agentsData.data && agentsData.data.ChatbotService_agents;

  const commonError = agentsData.error ? agentsData.error : error;

  if (agentsData.loading || loading) {
    return <ContentLoading shrinked={true} />;
  }

  if (commonError) {
    // TODO: handle errors
    return <ApolloErrorPage error={commonError} />;
  }

  const deleteAgentHandler = (agentId: number) => {
    deleteAgent({
      variables: {
        agentId,
      },
    });
  };

  const columns = [
    { title: 'ID', field: 'id' },
    {
      title: 'Name',
      field: 'uname',
      editable: 'never',
      renderRow: (agent: IAgent) => (
        <Link
          to={`/orgs/${orgId}/projects/${projectId}/chatbot-builder/agents/${agent.id}/Actions`}>
          {agent.uname}
        </Link>
      ),
    },
    { title: 'Language', field: 'config.language' },
  ];

  return (
    <React.Fragment>
      <Grid>
        {agents && (
          <CommonTable
            data={{
              columns,
              rowsData: agents,
            }}
            pagination={{
              rowsPerPage: 10,
            }}
            editable={{
              isDeleteable: true,
              onRowDelete: (agent: IAgent) => deleteAgentHandler(agent.id),
            }}
            nonRecordError="No Agents Found"
          />
        )}
      </Grid>
    </React.Fragment>
  );
}

export default AgentsTable;
