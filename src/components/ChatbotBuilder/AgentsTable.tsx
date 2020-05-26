import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import 'firebase/auth';
import { useQuery, useMutation } from '@apollo/react-hooks';
import React, {useState} from 'react';
import { CHATBOT_GET_AGENTS, CHATBOT_DELETE_AGENT } from '../../gql-queries';
import { IProject, IAgent } from '../../models';
import ApolloErrorPage from '../ApolloErrorPage';
import ContentLoading from '../ContentLoading';
import ConfirmDialog from '../Utils/ConfirmDialog';

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

interface IAgentsTableProps {
  activeProj: IProject;
}

interface IGetAgents {
    ChatbotService_agents: IAgent[] | undefined
}


function AgentsTable(props: IAgentsTableProps) {
  const classes = useStyles();
  const { activeProj } = props;
  const projectId = activeProj.id;
  const [confirmOpen, setConfirmOpen ] = useState(false)

  const agentsData = useQuery<IGetAgents>(CHATBOT_GET_AGENTS, { variables: { projectId } });
  const [deleteAgent, { loading, error }] = useMutation(CHATBOT_DELETE_AGENT,  {
    refetchQueries: [{ query: CHATBOT_GET_AGENTS, variables: { projectId }  }],
    awaitRefetchQueries: true,
  });

  const commonError = agentsData.error? agentsData.error : error;

  if (agentsData.loading || loading) {
    return <ContentLoading />;
  }
  
  if ( commonError) {
    // TODO: handle errors
    return <ApolloErrorPage error={commonError} />;
  }

  const deleteAgentHandler = async (agentId : number)=> {

    await deleteAgent({
        variables: {
          agentId
        },
      });
  }

  const agents = agentsData.data && agentsData.data.ChatbotService_agents;
  return (
    <Paper className={classes.paper}>
      {agents ? (
        <TableContainer component={Paper} aria-label="Agents">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Agent id</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.map((agent:IAgent) => (
                <TableRow key={agent.id}>
                  <TableCell>{agent.name}</TableCell>
                  <TableCell>{agent.id}</TableCell>
                  <TableCell> 
                     <IconButton aria-label="delete" onClick={() =>setConfirmOpen(true)}>
                        <DeleteIcon />
                     </IconButton>
                     <ConfirmDialog
                        title="Delete Agent?"
                        open={confirmOpen}
                        setOpen={setConfirmOpen}
                        onConfirm={() => deleteAgentHandler(Number(agent.id))}

                     >
                        Are you sure you want to delete this agent?
                    </ConfirmDialog>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
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
