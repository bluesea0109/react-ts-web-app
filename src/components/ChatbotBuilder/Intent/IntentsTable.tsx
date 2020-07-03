import { useMutation, useQuery } from '@apollo/react-hooks';
import { Paper, TableContainer, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import 'firebase/auth';
import MaterialTable, { Column } from 'material-table';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { CHATBOT_DELETE_INTENT, CHATBOT_GET_INTENTS, CHATBOT_UPDATE_INTENT } from '../../../common-gql-queries';
import { IIntent } from '../../../models/chatbot-service';
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

interface IGetIntents {
  ChatbotService_intents: IIntent[] | undefined;
}

interface IntentState {
  columns: Column<IIntent>[];
  data: IIntent[] | undefined;
}

function IntentsTable() {
  const classes = useStyles();
  const { agentId } = useParams();
  const numAgentId = Number(agentId);

  const intentsData = useQuery<IGetIntents>(CHATBOT_GET_INTENTS, { variables: { agentId: numAgentId } });
  const [updateIntent, updatedData] = useMutation(CHATBOT_UPDATE_INTENT, {
    refetchQueries: [{ query: CHATBOT_GET_INTENTS, variables: { agentId: numAgentId } }],
    awaitRefetchQueries: true,
  });
  const [deleteIntent, { loading, error }] = useMutation(CHATBOT_DELETE_INTENT, {
    refetchQueries: [{ query: CHATBOT_GET_INTENTS, variables: { agentId: numAgentId } }],
    awaitRefetchQueries: true,
  });

  const intents: IIntent[] | undefined = intentsData && intentsData.data && intentsData.data.ChatbotService_intents;

  const [state, setState] = React.useState<IntentState>({
    columns: [
      { title: 'Intent id', field: 'id', editable: 'never' },
      {
        title: 'Name',
        field: 'value',
        editable: 'onUpdate',
      },
      { title: 'Default Response', field: 'defaultResponse', editable: 'onUpdate' },
    ],
    data: intents,
  });

  useEffect(() => {
    if (intents) {
      setState({
        columns: state.columns,
        data: [...intents],
      });
    }

    return () => { };
  }, [intents, state.columns]);

  const commonError = intentsData.error ? intentsData.error : updatedData.error ? updatedData.error : error;

  if (intentsData.loading || updatedData.loading || loading) {
    return <ContentLoading />;
  }

  if (commonError) {
    // TODO: handle errors
    return <ApolloErrorPage error={commonError} />;
  }

  const updateIntentHandler = (intentId: number, value: string, defaultResponse: string) => {

    updateIntent({
      variables: {
        intentId,
        value,
        defaultResponse,
      },
    });
  };
  const deleteIntentHandler = (intentId: number) => {

    deleteIntent({
      variables: {
        intentId,
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
                  deleteText: 'Are you sure delete this Intent?',
                },
              },
            }}
            editable={{
              onRowUpdate: async (newData, oldData) => {
                if (oldData) {
                  const dataId = oldData.id;
                  const dataName = newData.value;
                  const dataResponse = newData.defaultResponse;
                  updateIntentHandler(dataId, dataName, dataResponse);
                }
              },
              onRowDelete: async (oldData) => {
                const dataId = oldData.id;
                deleteIntentHandler(dataId);
              },
            }}
          />
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
