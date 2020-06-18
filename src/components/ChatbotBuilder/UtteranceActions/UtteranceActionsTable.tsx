import { useMutation, useQuery } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import 'firebase/auth';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { CHATBOT_DELETE_UTTERANCE_ACTION, CHATBOT_GET_UTTERANCE_ACTIONS } from '../../../common-gql-queries';
import { IUtteranceAction } from '../../../models/chatbot-service';
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

interface IGetUtteranceActions {
  ChatbotService_utteranceActions: IUtteranceAction[] | undefined;
}

function UtteranceActionsTable() {
  const classes = useStyles();
  const { agentId } = useParams();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const numAgentId = Number(agentId);

  const actionsData = useQuery<IGetUtteranceActions>(CHATBOT_GET_UTTERANCE_ACTIONS, { variables: { agentId: numAgentId } });
  const [deleteAction, { loading, error }] = useMutation(CHATBOT_DELETE_UTTERANCE_ACTION, {
    refetchQueries: [{ query: CHATBOT_GET_UTTERANCE_ACTIONS, variables: { agentId: numAgentId } }],
    awaitRefetchQueries: true,
  });

  const commonError = actionsData.error ? actionsData.error : error;

  if (actionsData.loading || loading) {
    return <ContentLoading />;
  }

  if (commonError) {
    // TODO: handle errors
    return <ApolloErrorPage error={commonError} />;
  }

  const deleteUtteranceActionHandler = (utteranceActionId: number) => {
    deleteAction({
      variables: {
        utteranceActionId,
      },
    });
  };

  const actions = actionsData.data?.ChatbotService_utteranceActions;
  return (
    <Paper className={classes.paper}>
      {actions ? (
        <TableContainer component={Paper} aria-label="Utterance Actions">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Text</TableCell>
                <TableCell>Utterance Action id</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {actions.map((action: IUtteranceAction) => (
                <TableRow key={action.id}>
                  <TableCell>
                    {action.name}
                  </TableCell>
                  <TableCell>{action.text}</TableCell>
                  <TableCell>{action.id}</TableCell>
                  <TableCell>
                    <IconButton aria-label="delete" onClick={() => setConfirmOpen(true)}>
                      <DeleteIcon />
                    </IconButton>
                    <ConfirmDialog
                      title="Delete Action?"
                      open={confirmOpen}
                      setOpen={setConfirmOpen}
                      onConfirm={() => deleteUtteranceActionHandler(action.id)}

                    >
                      Are you sure you want to delete this template?
                    </ConfirmDialog>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
      ) : (
          <Typography align="center" variant="h6">
            {'No utterance actions found'}
          </Typography>
        )}
    </Paper>
  );
}

export default UtteranceActionsTable;
