import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { useParams } from 'react-router-dom';
import { GET_TRAINING_JOBS } from '../../../common-gql-queries';
import { ITrainingJob } from '../../../models/chatbot-service';
import { removeSpecialChars } from '../../../utils/string';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import { CommonTable, StatusChip } from '../../../components';

interface ITrainingJobsTableProps {
  toolbarActions?: React.ReactNode;
}

export default function TrainingJobsTable({
  toolbarActions,
}: ITrainingJobsTableProps) {
  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);

  interface IGetTrainingJobs {
    ChatbotService_trainingJobs: ITrainingJob[];
  }
  const getTrainingJobs = useQuery<IGetTrainingJobs>(GET_TRAINING_JOBS, {
    variables: { agentId },
  });

  if (getTrainingJobs.error) {
    return <ApolloErrorPage error={getTrainingJobs.error} />;
  }

  if (getTrainingJobs.loading) {
    return <ContentLoading shrinked={true} />;
  }

  const jobs = getTrainingJobs.data?.ChatbotService_trainingJobs || [];

  const columns = [
    { title: 'Job Id', field: 'jobId' },
    {
      title: 'Status',
      field: 'status',
      renderRow: (rowData: ITrainingJob) => (
        <StatusChip
          color={rowData.status === 'SUCCEEDED' ? 'green' : 'blue'}
          text={removeSpecialChars(rowData.status.toLowerCase())}
        />
      ),
    },
  ];

  return (
    <CommonTable
      data={{
        columns,
        rowsData: jobs,
      }}
      components={{
        Toolbar: () => (
          <Toolbar>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography variant="h6">Training Jobs</Typography>
              {toolbarActions}
            </Box>
          </Toolbar>
        ),
      }}
      pagination={{
        colSpan: 2,
        rowsPerPage: 10,
      }}
    />
  );
}
