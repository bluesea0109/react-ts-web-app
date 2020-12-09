import { useQuery } from '@apollo/client';
import { CommonTable, StatusChip } from '@bavard/react-components';
import { Typography } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import gql from 'graphql-tag';
import React from 'react';
import { useParams } from 'react-router-dom';
import { IAgentModelInfo } from '../../../models/chatbot-service';
import { removeSpecialChars } from '../../../utils/string';
import ApolloErrorPage from '../../ApolloErrorPage';

export default function AgentModelTable() {
  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);

  interface IGetAgentModel {
    ChatbotService_agentModelInfo: IAgentModelInfo | null;
  }
  const { data, error } = useQuery<IGetAgentModel>(GET_AGENT_MODEL_INFO, {
    variables: { agentId },
  });

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  const agentModel = data?.ChatbotService_agentModelInfo || null;

  const columns = [
    {
      title: 'Status',
      field: 'status',
      renderRow: (agentModel: IAgentModelInfo) => (
        <StatusChip
          color={agentModel.status === 'READY' ? 'green' : 'blue'}
          text={removeSpecialChars(agentModel.status.toLowerCase())}
        />
      ),
    },
    { title: 'Name', field: 'name' },
  ];

  return (
    <CommonTable
      data={{ columns, rowsData: agentModel ? [agentModel] : [] }}
      localization={{
        nonRecordError: 'No model has been deployed yet for this assistant.',
      }}
      components={{
        Toolbar: () => (
          <Toolbar>
            <Typography variant="h6">Assistant Models</Typography>
          </Toolbar>
        ),
      }}
    />
  );
}

const GET_AGENT_MODEL_INFO = gql`
  query($agentId: Int!) {
    ChatbotService_agentModelInfo(agentId: $agentId) {
      name
      status
    }
  }
`;
