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
import gql from 'graphql-tag';
import React from 'react';
import { useParams } from 'react-router-dom';
import StatusChip from '../../../components/StatusChip';
import { IAgentModelInfo } from '../../../models/chatbot-service';
import { removeSpecialChars } from '../../../utils/string';
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
  }),
);

export default function AgentModelTable() {
  const classes = useStyles();
  const { agentId } = useParams<{ agentId: string }>();
  const numAgentId = parseInt(agentId, 10);

  interface IGetAgentModel {
    ChatbotService_agentModelInfo: IAgentModelInfo | null;
  }
  const getModel = useQuery<IGetAgentModel>(GET_AGENT_MODEL_INFO, {
    variables: { agentId: numAgentId },
  });

  if (getModel.error) {
    return <ApolloErrorPage error={getModel.error} />;
  }

  if (getModel.loading) {
    return <ContentLoading />;
  }

  const agentModel = getModel.data?.ChatbotService_agentModelInfo || null;

  return (
    <Paper className={classes.paper}>
      <Toolbar>
        <Typography variant="h6">Agent Models</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {agentModel && (
            <TableRow>
              <TableCell align="left">
                <StatusChip
                  color={agentModel.status === 'READY' ? 'green' : 'blue'}
                  text={removeSpecialChars(agentModel.status.toLowerCase())}
                />
              </TableCell>
              <TableCell align="left">{agentModel.name}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {!agentModel && (
        <Typography align="center">
          {'No model has been deployed yet for this agent.'}
        </Typography>
      )}
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
