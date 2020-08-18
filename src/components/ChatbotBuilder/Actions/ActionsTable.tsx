import {
  Box, Button,
  Grid,
  Paper,
  TableContainer,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Edit } from '@material-ui/icons';
import 'firebase/auth';
import _ from 'lodash';
import MaterialTable, { Column } from 'material-table';
import React, { useEffect } from 'react';
import { AnyAction } from '../../../models/chatbot-service';

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

interface ActionState {
  columns: Column<AnyAction>[];
  data: AnyAction[] | undefined;
}

interface ActionsTableProps {
  onEditAction: (id: number) => void;
  actions: AnyAction[];
  loading: boolean;
  onAdd: () => void;
}

function ActionsTable({ onEditAction, actions, loading, onAdd }: ActionsTableProps) {
  const classes = useStyles();

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

  return (
    <Paper className={classes.paper}>
      {state && state.data && state.data.length > 0 ? (
        <TableContainer component={Paper} aria-label="Agents">
          <MaterialTable
            isLoading={loading}
            title={
              <Button disabled={loading} variant="contained" color="primary" onClick={onAdd}>Add New Action</Button>
            }
            columns={state.columns}
            data={_.cloneDeep(state.data)}
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
                tooltip: 'Edit Action',
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

type OtherProps = { [index: string]: any };

const ActionDetailPanel = ({ action }: { action: AnyAction }) => {
    const { id, type, name, agentId, ...otherProps } = action;
    const actionProps = otherProps as OtherProps;

    return (
      <Grid container={true}>
        <Grid item={true} xs={6}>
          {Array.from(Object.keys(actionProps)).map(key => (
            <Box my={3} key={key}>
              <Typography variant="h6" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{key}</Typography>
              {key === 'text' ? (
                <p dangerouslySetInnerHTML={{ __html: actionProps[key] }} />
              ) : (
                <Typography variant="caption" style={{ textTransform: 'capitalize' }}>{JSON.stringify(actionProps[key])}</Typography>
              )}
            </Box>
          ))}
        </Grid>
      </Grid>
    );
};

export default ActionsTable;
