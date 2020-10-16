import { useQuery } from '@apollo/client';
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
import gql from 'graphql-tag';
import React from 'react';
import { useParams } from 'react-router-dom';
import { IAgentModelInfo } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    paper: {
      width: '100%',
    },
  }));

export default function AgentModelTable() {
  const classes = useStyles();
  let { agentId } = useParams();
  agentId = parseInt(agentId, 10);

  interface IGetAgentModel {
    ChatbotService_agentModelInfo: IAgentModelInfo | null;
  }
  const getModel = useQuery<IGetAgentModel>(GET_AGENT_MODEL_INFO, { variables: { agentId } });

  if (getModel.error) {
    return <ApolloErrorPage error={getModel.error} />;
  }

  if (getModel.loading) {
    return <ContentLoading />;
  }

  const agentModel = getModel.data?.ChatbotService_agentModelInfo || null;

  return (
    <Paper className={classes.paper}>
      <Toolbar variant="dense">
        <Typography variant="h5">Agent Model Info</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {agentModel ? (
              <TableRow>
              <TableCell align="left">{agentModel.name}</TableCell>
              <TableCell align="left">{agentModel.status}</TableCell>
            </TableRow>
          ) : (
            <Typography>{'No model has been deployed yet for this agent.'}</Typography>
          )}
        </TableBody>
      </Table>
    </Paper>
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
