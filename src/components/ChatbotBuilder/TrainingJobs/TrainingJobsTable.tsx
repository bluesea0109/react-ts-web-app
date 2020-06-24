import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { useQuery } from 'react-apollo';
import { useParams } from 'react-router-dom';
import { ITrainingJob } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import { GET_TRAINING_JBOS } from '../../../common-gql-queries';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    paper: {
      width: '100%',
    },
  }));

export default function TrainingJobsTable() {
  const classes = useStyles();
  let { agentId } = useParams();
  agentId = parseInt(agentId, 10);

  interface IGetTrainingJobs {
    ChatbotService_trainingJobs: ITrainingJob[];
  }
  const getTrainingJobs = useQuery<IGetTrainingJobs>(GET_TRAINING_JBOS, { variables: { agentId } });

  if (getTrainingJobs.error) {
    return <ApolloErrorPage error={getTrainingJobs.error} />;
  }

  if (getTrainingJobs.loading) {
    return <ContentLoading />;
  }

  const jobs = getTrainingJobs.data?.ChatbotService_trainingJobs || [];

  return (
    <Paper className={classes.paper}>
      <Toolbar variant="dense">
        <Typography variant="h5">Training Jobs</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Job Id</TableCell>
            <TableCell align="left">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => {
            return (
              <TableRow key={job.jobId} hover={true}>
                <TableCell align="left">{job.jobId}</TableCell>
                <TableCell align="left">{job.status}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

