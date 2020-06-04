import { useMutation, useQuery } from '@apollo/react-hooks';
import { Paper, TableContainer, Typography} from '@material-ui/core';
import MaterialTable, { Column } from 'material-table';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import 'firebase/auth';
import React, {useEffect} from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { CHATBOT_DELETE_AGENT, CHATBOT_GET_AGENTS, CHATBOT_UPDATE_AGENT } from '../../../common-gql-queries';
import {  IAgent } from '../../../models';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';

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
  const { projectId, orgId } = useParams();
  const agentsData = useQuery<IGetAgents>(CHATBOT_GET_AGENTS, { variables: { projectId } });
  const [deleteAgent, { loading, error }] = useMutation(CHATBOT_DELETE_AGENT,  {
    refetchQueries: [{ query: CHATBOT_GET_AGENTS, variables: { projectId }  }],
    awaitRefetchQueries: true,
  });
  const [updateAgent, updatedData ] = useMutation(CHATBOT_UPDATE_AGENT,  {
    refetchQueries: [{ query: CHATBOT_GET_AGENTS, variables: { projectId }  }],
    awaitRefetchQueries: true,
  });
  const agents: IAgent[] | undefined = agentsData && agentsData.data && agentsData.data.ChatbotService_agents;
  const [state, setState] = React.useState<AgentState>({
    columns: [
      { title: 'Agent id', field: 'id', editable: 'never' },
      { title: 'Name', 
         field: 'name', 
         render: rowData => <Link  to={`/orgs/${orgId}/projects/${projectId}/chatbot-builder/agents/${rowData.id}/Intents`}>
         {rowData.name}
     </Link>,
     editable: 'onUpdate'
      },
      { title: 'Language', field: 'language', editable: 'never' },
    ],
    data: agents,
  });

  useEffect(() => {
    if(agents) {
      setState({
        columns: state.columns,
        data : [...agents]
      })
    }
    
    return () => {}
  }, [agents, state.columns])

  const commonError = agentsData.error ? agentsData.error : updatedData.error ? updatedData.error : error;

  if (agentsData.loading || updatedData.loading || loading ) {
    return <ContentLoading />;
  }

  if ( commonError) {
    // TODO: handle errors
    return <ApolloErrorPage error={commonError} />;
  }


    

  const deleteAgentHandler =  (agentId: number) => {
     deleteAgent({
        variables: {
          agentId
        },
      });
  };

  const updateAgentHandler =  (agentId: number, name:string) => {
    updateAgent({
       variables: {
         agentId,
         name
       },
     });
 };

  return (
    <Paper className={classes.paper}>
      {state && state.data && state.data.length > 0 ? (
        <TableContainer component={Paper} aria-label="Agents">
          <MaterialTable
      title="Agents Table"
      columns={state.columns}
      data={state.data}
      options={{
        actionsColumnIndex: -1,
      }}

      localization={{
        body: {
          editRow: {
            deleteText : "Are you sure delete this Agent?"
          }
        }
      }}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              if (oldData) {
                setState((prevState:any) => {
                  const data = [...prevState.data];
                  const dataId = oldData.id;
                  const dataName = newData.name;
                  updateAgentHandler(dataId, dataName);
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
              resolve();
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
              if (oldData) {
              setState((prevState:any) => {
                const data = [...prevState.data];
                const dataId = oldData.id;
                deleteAgentHandler(dataId);
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }
            resolve();
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
