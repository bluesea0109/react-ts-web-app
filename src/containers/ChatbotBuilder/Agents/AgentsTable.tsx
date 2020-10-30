import { useMutation, useQuery } from '@apollo/client';
import { Grid, TableContainer, Typography } from '@material-ui/core';
import 'firebase/auth';
import _ from 'lodash';
import MaterialTable, { Column } from 'material-table';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import {
  CHATBOT_DELETE_AGENT,
  CHATBOT_GET_AGENTS,
} from '../../../common-gql-queries';
import { IAgent } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';

interface IGetAgents {
  ChatbotService_agents: IAgent[] | undefined;
}

interface AgentState {
  columns: Column<IAgent>[];
  data: IAgent[] | undefined;
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

  const [state, setState] = React.useState<AgentState>({
    columns: [
      { title: 'ID', field: 'id', editable: 'never' },
      {
        title: 'Unique Name',
        field: 'uname',
        editable: 'never',
        render: (rowData) => (
          <Link
            to={`/orgs/${orgId}/projects/${projectId}/chatbot-builder/agents/${rowData.id}/Actions`}>
            {rowData.uname}
          </Link>
        ),
      },
      { title: 'Language', field: 'config.language', editable: 'never' },
    ],
    data: agents ? [...agents] : [],
  });

  useEffect(() => {
    if (agents) {
      setState({
        columns: state.columns,
        data: [...agents],
      });
    }

    return () => {};
  }, [agents, state.columns]);

  const commonError = agentsData.error ? agentsData.error : error;

  if (agentsData.loading || loading) {
    return <ContentLoading shrinked={true}/>;
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

  return (
    <React.Fragment>
      {state && state.data && state.data.length > 0 ? (
        <Grid>
          <MaterialTable
            components={{
              Container: TableContainer,
            }}
            title="Assistants"
            columns={state.columns.map((c) => {
              return {
                ...c,
                cellStyle: {
                  borderColor: 'transparent',
                },
              };
            })}
            data={_.cloneDeep(state.data)}
            options={{
              actionsColumnIndex: -1,
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              actionsCellStyle: {
                borderColor: 'transparent',
              },
            }}
            localization={{
              body: {
                editRow: {
                  deleteText: 'Are you sure you want to delete this assistant?',
                },
              },
            }}
            editable={{
              onRowDelete: async (oldData) => {
                const dataId = oldData.id;
                deleteAgentHandler(dataId);
              },
            }}
          />
        </Grid>
      ) : (
        <Typography align="center" variant="h6">
          {'No Agents found'}
        </Typography>
      )}
    </React.Fragment>
  );
}

export default AgentsTable;
