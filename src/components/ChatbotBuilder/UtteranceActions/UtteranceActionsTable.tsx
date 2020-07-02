import { useMutation, useQuery } from '@apollo/react-hooks';
import { Paper, TableContainer, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import 'firebase/auth';
import MaterialTable, { Column } from 'material-table';
import React, {  useEffect} from 'react';
import { useParams } from 'react-router';
import { CHATBOT_DELETE_UTTERANCE_ACTION, CHATBOT_GET_UTTERANCE_ACTIONS, CHATBOT_UPDATE_UTTERANCE_ACTION  } from '../../../common-gql-queries';
import { IUtteranceAction } from '../../../models/chatbot-service';
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

interface IGetUtteranceActions {
  ChatbotService_utteranceActions: IUtteranceAction[] | undefined;
}

interface ActionState {
  columns: Column<IUtteranceAction>[];
  data: IUtteranceAction[] | undefined;
}

function UtteranceActionsTable() {
  const classes = useStyles();
  const { agentId } = useParams();
  const numAgentId = Number(agentId);

  const actionsData = useQuery<IGetUtteranceActions>(CHATBOT_GET_UTTERANCE_ACTIONS, { variables: { agentId: numAgentId } });

  const [updateAction, updatedData] = useMutation(CHATBOT_UPDATE_UTTERANCE_ACTION, {
    refetchQueries: [{ query: CHATBOT_GET_UTTERANCE_ACTIONS, variables: { agentId: numAgentId } }],
    awaitRefetchQueries: true,
  });

  const [deleteAction, { loading, error }] = useMutation(CHATBOT_DELETE_UTTERANCE_ACTION, {
    refetchQueries: [{ query: CHATBOT_GET_UTTERANCE_ACTIONS, variables: { agentId: numAgentId } }],
    awaitRefetchQueries: true,
  });

  const actions: IUtteranceAction[] | undefined = actionsData && actionsData.data && actionsData.data.ChatbotService_utteranceActions;

  const [state, setState] = React.useState<ActionState>({
    columns: [
      { title: 'Action id', field: 'id', editable: 'never' },
      {
        title: 'Name',
        field: 'name',
        editable: 'onUpdate',
      },
      { title: 'Text', field: 'text', editable: 'onUpdate' },
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

    return () => { };
  }, [actions, state.columns]);

  const commonError = actionsData.error ? actionsData.error : updatedData.error ? updatedData.error : error;

  if (actionsData.loading || updatedData.loading || loading) {
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

  const updateUtteranceActionHandler = (utteranceActionId: number, name: string, text: string) => {
    updateAction({
      variables: {
        utteranceActionId,
        name,
        text,
      },
    });
  };

  return (
    <Paper className={classes.paper}>
      {state && state.data && state.data.length > 0 ? (
        <TableContainer component={Paper} aria-label="Actions">
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
                  deleteText: 'Are you sure delete this Action?',
                },
              },
            }}
            editable={{
              onRowUpdate: async (newData, oldData) => {
                if (oldData) {
                  const dataId = oldData.id;
                  const name = newData.name;
                  const text = newData.text;
                  updateUtteranceActionHandler(dataId, name, text);
                }
              },
              onRowDelete: async (oldData) => {
                const dataId = oldData.id;
                deleteUtteranceActionHandler(dataId);
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
