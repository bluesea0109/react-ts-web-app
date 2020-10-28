import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { useParams } from 'react-router-dom';
import { GET_TRAINING_JOBS } from '../../../common-gql-queries';
import StatusChip from '../../../components/StatusChip';
import { ITrainingJob } from '../../../models/chatbot-service';
import { removeSpecialChars } from '../../../utils/string';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';

interface ITrainingJobsTableProps {
  toolbarActions?: React.ReactNode;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    paper: {
      width: '100%',
      height: 500,
      overflow: 'auto',
    },
    toolbarItems: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
    },
  }),
);

export default function TrainingJobsTable({
  toolbarActions,
}: ITrainingJobsTableProps) {
  const classes = useStyles();
  let { agentId } = useParams();
  agentId = parseInt(agentId, 10);

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
    return <ContentLoading />;
  }

  const jobs = getTrainingJobs.data?.ChatbotService_trainingJobs || [];

  return (
    <Paper className={classes.paper}>
      <Toolbar>
        <div className={classes.toolbarItems}>
          <Typography variant="h6">Training Jobs</Typography>
          {toolbarActions}
        </div>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Job ID</TableCell>
            <TableCell align="left">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => {
            return (
              <TableRow key={job.jobId} hover={true}>
                <TableCell align="left">{job.jobId}</TableCell>
                <TableCell align="left">
                  <StatusChip
                    color={job.status === 'SUCCEEDED' ? 'green' : 'blue'}
                    text={removeSpecialChars(job.status.toLowerCase())}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
