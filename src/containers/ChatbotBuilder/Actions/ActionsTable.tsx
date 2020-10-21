import { BaseAgentAction } from '@bavard/agent-config';
import {
  Box,
  Button,
  Paper,
  TableContainer,
  Typography,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MaterialTable, { Column } from 'material-table';
import 'firebase/auth';
import _ from 'lodash';
import React, { useEffect } from 'react';
import ActionDetailPanel from './ActionDetailPanel';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      padding: theme.spacing(3),
    }
  })
);

interface ActionState {
  columns: Column<BaseAgentAction>[];
  data: BaseAgentAction[] | undefined;
}

interface ActionsTableProps {
  actions: BaseAgentAction[];
  onAddAction: () => void;
  onEditAction: (action: BaseAgentAction) => void;
  onDeleteAction: (action: BaseAgentAction) => void;
}

const ActionsTable = ({
  actions,
  onAddAction,
  onEditAction,
  onDeleteAction,
}: ActionsTableProps) => {
  const classes = useStyles();

  const [state, setState] = React.useState<ActionState>({
    columns: [
      { title: 'Action Name', field: 'name', editable: 'never' },
      { title: 'Action Type', field: 'type', editable: 'never' },
    ],
    data: actions,
  });

  useEffect(() => {
    if (!actions) { return; }

    setState({
      columns: state.columns,
      data: [...actions],
    });
  }, [actions, state.columns]);

  return (state && state.data && state.data.length > 0) ? (
    <TableContainer component={Paper} aria-label="Agents" className={classes.root}>
      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        paddingBottom={2}
      >
        <Box>
          <Typography variant="h6">
            Actions
          </Typography>
          <Typography>
            Select an Action below to change the Assistant's behavior:
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={onAddAction}>
          Add New Action
        </Button>
      </Box>

      <MaterialTable
        columns={state.columns}
        data={_.cloneDeep(state.data)}
        detailPanel={({ tableData, ...actionDetails }: any) => (
          <ActionDetailPanel action={actionDetails}/>
        )}
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
  );
};

export default ActionsTable;
