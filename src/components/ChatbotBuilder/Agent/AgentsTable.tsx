import { useMutation, useQuery } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MaterialTable, { Column } from 'material-table';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import 'firebase/auth';
import React, {useState} from 'react';
import { useParams } from 'react-router';
import { Link  } from 'react-router-dom';
import { CHATBOT_DELETE_AGENT, CHATBOT_GET_AGENTS } from '../../../common-gql-queries';
import {  IAgent } from '../../../models';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import ConfirmDialog from '../../Utils/ConfirmDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(2),
    },
  }),
);

interface IGetAgents {
    ChatbotService_agents: IAgent[] | undefined;
}

interface AgentState {
  columns: Array<Column<IAgent>>;
  data: IAgent[] | undefined;
}



function AgentsTable() {
  const classes = useStyles();
  const { orgId, projectId } = useParams();
  const [confirmOpen, setConfirmOpen ] = useState(false);

  const agentsData = useQuery<IGetAgents>(CHATBOT_GET_AGENTS, { variables: { projectId } });
  const [deleteAgent, { loading, error }] = useMutation(CHATBOT_DELETE_AGENT,  {
    refetchQueries: [{ query: CHATBOT_GET_AGENTS, variables: { projectId }  }],
    awaitRefetchQueries: true,
  });
  const agents: IAgent[] | undefined = agentsData && agentsData.data && agentsData.data.ChatbotService_agents;

  const [state, setState] = React.useState<AgentState>({
    columns: [
      { title: 'Agent id', field: 'id' },
      { title: 'projectId', field: 'projectId' },
      { title: 'Name', field: 'name' },
      { title: 'Language', field: 'language' },
    ],
    data: agents,
  });

  const commonError = agentsData.error ? agentsData.error : error;

  if (agentsData.loading || loading) {
    return <ContentLoading />;
  }

  if ( commonError) {
    // TODO: handle errors
    return <ApolloErrorPage error={commonError} />;
  }

  const deleteAgentHandler =  (agentId: number) => {

     deleteAgent({
        variables: {
          agentId,
        },
      });
  };

  return (
    <Paper className={classes.paper}>
      {state && state.data ? (
        <TableContainer component={Paper} aria-label="Agents">
          <MaterialTable
      title="Agents Table"
      columns={state.columns}
      data={state.data}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState((prevState:any) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState:any) => {
                const data = [...prevState.data];
                console.log(data.indexOf(oldData))
                const dataId = Number(oldData.id);
                deleteAgentHandler(dataId)
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
    />
        </TableContainer>
      ) : (
          <Typography align="center" variant="h6">
            {'No Agents found'}
          </Typography>
        )}
    </Paper>
  );
}

export default AgentsTable;
