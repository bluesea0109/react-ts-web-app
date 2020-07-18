import { useQuery } from '@apollo/react-hooks';
import {
  LinearProgress,
  Paper,
  TableContainer,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import 'firebase/auth';
import MaterialTable, { Column } from 'material-table';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { IAction } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import { GET_ACTIONS_QUERY } from './gql';

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

interface IGetActions {
  ChatbotService_actions: IAction[] | undefined;
}

interface ActionState {
  columns: Column<IAction>[];
  data: IAction[] | undefined;
}

function ActionsTable() {
  const classes = useStyles();
  const { agentId } = useParams();
  const numAgentId = Number(agentId);

  const actionsData = useQuery<IGetActions>(GET_ACTIONS_QUERY, {
    variables: { agentId: numAgentId },
  });

  const actions: IAction[] | undefined =
    actionsData && actionsData.data && actionsData.data.ChatbotService_actions;

  const [state, setState] = React.useState<ActionState>({
    columns: [
      { title: 'Action id', field: 'id', editable: 'never' },
      {
        title: 'Name',
        field: 'name',
        editable: 'never',
      },
      { title: 'Action Type', field: 'type', editable: 'never' },
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

  const commonError = actionsData.error;

  if (commonError) {
    // TODO: handle errors
    return <ApolloErrorPage error={commonError} />;
  }

  return (
    <Paper className={classes.paper}>
      {actionsData.loading && <LinearProgress />}
      {state && state.data && state.data.length > 0 ? (
        <TableContainer component={Paper} aria-label="Agents">
          <MaterialTable
            title="Agents Table"
            columns={state.columns}
            data={state.data}
            options={{
              actionsColumnIndex: -1,
              pageSize: 20,
            }}
          />
        </TableContainer>
      ) : (
        <Typography align="center" variant="h6">
          {'No Actions found'}
        </Typography>
      )}
    </Paper>
  );
}

export default ActionsTable;
