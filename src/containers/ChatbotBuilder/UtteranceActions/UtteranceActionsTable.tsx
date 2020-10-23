import { useMutation, useQuery } from '@apollo/client';
import { IAgentUtteranceAction } from '@bavard/agent-config';
import {
  LinearProgress,
  Paper,
  TableContainer,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import 'firebase/auth';
import _ from 'lodash';
import MaterialTable, { Column } from 'material-table';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import {
  CHATBOT_DELETE_UTTERANCE_ACTION,
  CHATBOT_GET_UTTERANCE_ACTIONS,
  CHATBOT_UPDATE_UTTERANCE_ACTION,
} from '../../../common-gql-queries';
import ApolloErrorPage from '../../ApolloErrorPage';

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
  ChatbotService_utteranceActions: IAgentUtteranceAction[] | undefined;
}

interface ActionState {
  columns: Column<IAgentUtteranceAction>[];
  data: IAgentUtteranceAction[] | undefined;
}

function UtteranceActionsTable() {
  const classes = useStyles();
  const { agentId } = useParams<{ agentId: string }>();
  const numAgentId = Number(agentId);

  const actionsData = useQuery<IGetUtteranceActions>(
    CHATBOT_GET_UTTERANCE_ACTIONS,
    { variables: { agentId: numAgentId } },
  );

  const [updateAction, updatedData] = useMutation(
    CHATBOT_UPDATE_UTTERANCE_ACTION,
    {
      refetchQueries: [
        {
          query: CHATBOT_GET_UTTERANCE_ACTIONS,
          variables: { agentId: numAgentId },
        },
      ],
      awaitRefetchQueries: true,
    },
  );

  const [deleteAction, { loading, error }] = useMutation(
    CHATBOT_DELETE_UTTERANCE_ACTION,
    {
      refetchQueries: [
        {
          query: CHATBOT_GET_UTTERANCE_ACTIONS,
          variables: { agentId: numAgentId },
        },
      ],
      awaitRefetchQueries: true,
    },
  );

  const actions: IAgentUtteranceAction[] | undefined =
    actionsData &&
    actionsData.data &&
    actionsData.data.ChatbotService_utteranceActions;

  const [state, setState] = React.useState<ActionState>({
    columns: [
      { title: 'Action id', field: 'id', editable: 'never' },
      { title: 'Utterance', field: 'text', editable: 'onUpdate' },
    ],
    data: actions,
  });

  useEffect(() => {
    if (actions) {
      setState({
        columns: state.columns,
        data: [...actions],
      });
    }

    return () => {};
  }, [actions, state.columns]);

  const commonError = actionsData.error
    ? actionsData.error
    : updatedData.error
    ? updatedData.error
    : error;

  if (commonError) {
    // TODO: handle errors
    return <ApolloErrorPage error={commonError} />;
  }

  const deleteUtteranceActionHandler = async (name: string) => {
    await deleteAction({
      variables: {
        name,
      },
    });
  };

  const updateUtteranceActionHandler = async (
    name: string,
    utterance: string,
  ) => {
    await updateAction({
      variables: {
        name,
        utterance,
      },
    });
  };

  return (
    <Paper className={classes.paper}>
      {(actionsData.loading || updatedData.loading || loading) && (
        <LinearProgress />
      )}
      {state && state.data && state.data.length > 0 ? (
        <TableContainer component={Paper} aria-label="Actions">
          <MaterialTable
            title="Agents Table"
            columns={state.columns}
            data={_.cloneDeep(state.data)}
            options={{
              actionsColumnIndex: -1,
              pageSize: 20,
            }}
            localization={{
              body: {
                editRow: {
                  deleteText: 'Are you sure delete this Action?',
                },
              },
            }}
            editable={{
              onRowUpdate: async (newData, oldData) => {
                if (oldData) {
                  const text = newData.utterance;
                  await updateUtteranceActionHandler(oldData.name, text);
                }
              },
              onRowDelete: async (oldData) => {
                await deleteUtteranceActionHandler(oldData.name);
              },
            }}
          />
        </TableContainer>
      ) : (
        <Typography align="center" variant="h6">
          {'No Action found'}
        </Typography>
      )}
    </Paper>
  );
}

export default UtteranceActionsTable;
