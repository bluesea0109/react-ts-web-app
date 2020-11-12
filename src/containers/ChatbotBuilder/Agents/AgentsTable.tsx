import { Grid } from '@material-ui/core';
import 'firebase/auth';
import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { CommonTable } from '../../../components';
import { IAgent } from '../../../models/chatbot-service';

export interface IAgentsTableProps {
  agents: IAgent[];
  onDeleteAgent: (agent: IAgent) => void;
}

const AgentsTable = ({ agents, onDeleteAgent }: IAgentsTableProps) => {
  const { projectId, orgId } = useParams<{
    projectId: string;
    orgId: string;
  }>();

  const columns = [
    { title: 'ID', field: 'id' },
    {
      title: 'Name',
      field: 'uname',
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
              onRowDelete: onDeleteAgent,
            }}
            localization={{
              nonRecordError: 'No Agents Found',
            }}
          />
        )}
      </Grid>
    </React.Fragment>
  );
};

export default AgentsTable;
