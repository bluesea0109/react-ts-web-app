import { useMutation, useQuery } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import 'firebase/auth';
import React, {useState} from 'react';
import { useParams } from 'react-router';
import { CHATBOT_DELETE_INTENT, CHATBOT_GET_INTENTS } from '../../../common-gql-queries';
import { IIntent } from '../../../models/chatbot-service';
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

interface IGetIntents {
  ChatbotService_intents: IIntent[] | undefined;
}

function IntentsTable() {
  const classes = useStyles();
  const { agentId } = useParams();
  const [confirmOpen, setConfirmOpen ] = useState(false);
  const numAgentId = Number(agentId);

  const intentsData = useQuery<IGetIntents>(CHATBOT_GET_INTENTS, { variables: { agentId: numAgentId } });
  const [deleteIntent, { loading, error }] = useMutation(CHATBOT_DELETE_INTENT,  {
    refetchQueries: [{ query: CHATBOT_GET_INTENTS, variables: { agentId : numAgentId }  }],
    awaitRefetchQueries: true,
  });

  const commonError = intentsData.error ? intentsData.error : error;

  if (intentsData.loading || loading) {
    return <ContentLoading />;
  }

  if ( commonError) {
    return <ApolloErrorPage error={commonError} />;
  }

  const deleteIntentHandler =  (intentId: number) => {

    deleteIntent({
        variables: {
          intentId,
        },
      });
  };

  const intents = intentsData.data && intentsData.data.ChatbotService_intents;
  console.log(intents);
  return (
    <Paper className={classes.paper}>
      {intents ? (
        <TableContainer component={Paper} aria-label="Intents">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Intent id</TableCell>
                <TableCell>Default Response</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {intents.map((intent: IIntent) => (
                <TableRow key={intent.id}>
                  <TableCell>
                        {intent.value}
                  </TableCell>
                  <TableCell>{intent.id}</TableCell>
                  <TableCell>{intent.defaultResponse}</TableCell>
                  <TableCell>
                     <IconButton aria-label="delete" onClick={() => setConfirmOpen(true)}>
                        <DeleteIcon />
                     </IconButton>
                     <ConfirmDialog
                        title="Delete Intent?"
                        open={confirmOpen}
                        setOpen={setConfirmOpen}
                        onConfirm={() => deleteIntentHandler(Number(intent.id))}

                     >
                        Are you sure you want to delete this intent?
                    </ConfirmDialog>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
      ) : (
          <Typography align="center" variant="h6">
            {'No Intents found'}
          </Typography>
        )}
    </Paper>
  );
}

export default IntentsTable;
