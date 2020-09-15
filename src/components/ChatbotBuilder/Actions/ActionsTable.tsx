import { BaseAgentAction } from '@bavard/agent-config';
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
  columns: Column<BaseAgentAction>[];
  data: BaseAgentAction[] | undefined;
}

interface ActionsTableProps {
  onEditAction: (action: BaseAgentAction) => void;
  onDeleteAction: (action: BaseAgentAction) => void;
  actions: BaseAgentAction[];
  onAdd: () => void;
}

function ActionsTable({
  onAdd,
  onEditAction,
  onDeleteAction,
  actions,
}: ActionsTableProps) {
  const classes = useStyles();

  const [state, setState] = React.useState<ActionState>({
    columns: [
      { title: 'Action Name', field: 'name', editable: 'never' },
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
            title={
              <Button variant="contained" color="primary" onClick={onAdd}>Add New Action</Button>
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
                icon: (_: any) => <Edit />,
                tooltip: 'Edit Action',
                onClick: (_, rowData) => onEditAction(rowData as BaseAgentAction),
              },
            ]}
            editable={{
              onRowDelete: async (action) => onDeleteAction(action as BaseAgentAction),
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

type OtherProps = { [index: string]: any };

const ActionDetailPanel = ({ action }: { action: BaseAgentAction }) => {
  const { type, name, ...otherProps } = action;
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
