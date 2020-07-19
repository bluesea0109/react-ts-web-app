import { useQuery } from '@apollo/react-hooks';
import {
  Box,
  Grid,
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
import { AnyAction } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import { GET_ACTIONS_QUERY } from './gql';
import { Edit } from '@material-ui/icons';

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
  ChatbotService_actions: AnyAction[] | undefined;
}

interface ActionState {
  columns: Column<AnyAction>[];
  data: AnyAction[] | undefined;
}

interface ActionsTableProps {
  onEditAction: (id: number) => void;
}

function ActionsTable({ onEditAction }: ActionsTableProps) {
  const classes = useStyles();
  const { agentId } = useParams();
  const numAgentId = Number(agentId);

  const actionsData = useQuery<IGetActions>(GET_ACTIONS_QUERY, {
    variables: { agentId: numAgentId },
  });

  const actions: AnyAction[] | undefined =
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
            detailPanel={({ tableData, ...actionDetails }: any) => <ActionDetailPanel action={actionDetails} />}
            options={{
              actionsColumnIndex: -1,
              filtering: true,
              search: false,
              paging: true,
              pageSize: 10,
            }}
            actions={[
              {
                icon: (props: any) => <Edit />,
                tooltip: 'Edit Example',
                onClick: (event, rowData) => {
                  const data = rowData as AnyAction;
                  onEditAction(data.id);
                },
              },
            ]}
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

type OtherProps = { [index: string]: any }

const ActionDetailPanel = ({ action }: { action: AnyAction }) => {
    const { id, type, name, agentId, ...otherProps } = action;
    const actionProps = otherProps as OtherProps;

    return (
      <Grid container>
        <Grid item xs={6}>
          {Array.from(Object.keys(actionProps)).map(key => (
            <Box my={3}>
              <Typography variant='h6' style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{key}</Typography>
              <Typography variant='caption' style={{ textTransform: 'capitalize' }}>{actionProps[key]}</Typography>
            </Box>
          ))}
        </Grid>
      </Grid>
    )
};

export default ActionsTable;
