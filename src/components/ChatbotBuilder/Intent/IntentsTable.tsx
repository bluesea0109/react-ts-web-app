import { BaseAgentAction, IIntent } from '@bavard/agent-config';
import {
  Button,
  Paper,
  TableContainer, Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Edit } from '@material-ui/icons';
import 'firebase/auth';
import _ from 'lodash';
import MaterialTable, { Column } from 'material-table';
import React from 'react';

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

interface IntentsTableProps {
  onEditIntent: (intent: IIntent) => void;
  onDeleteIntent: (intent: IIntent) => void;
  intents: IIntent[];
  actions: BaseAgentAction[];
  onAdd: () => void;
}

function IntentsTable({
  intents,
  actions,
  onAdd,
  onEditIntent,
  onDeleteIntent,
}: IntentsTableProps) {
  const classes = useStyles();
  const columns: Column<IIntent>[] = [
    {
      title: 'Name',
      field: 'name',
      editable: 'never',
    },
    {
      title: 'Default Action',
      render: rowData => rowData.defaultActionName ??
        <Typography style={{ color: '#808080' }}>N/A</Typography>,
      editable: 'never',
    },
  ];

  const deleteIntentHandler = (intent: IIntent) => {
    onDeleteIntent(intent);
  };

  return (
    <Paper className={classes.paper}>
      <TableContainer component={Paper} aria-label="Agents">
        <MaterialTable
          title={
            <Button variant="contained" color="primary" onClick={onAdd}>Add New Intent</Button>
          }
          columns={columns}
          data={_.cloneDeep(intents)}
          options={{
            actionsColumnIndex: -1,
            paging: true,
            pageSize: 10,
          }}
          localization={{
            body: {
              editRow: {
                deleteText: 'Are you sure delete this Intent?',
              },
            },
          }}
          actions={[
            {
              icon: () => <Edit />,
              tooltip: 'Edit Intent',
              onClick: (event, rowData) => {
                const data = rowData as IIntent;
                onEditIntent(data);
              },
            },
          ]}
          editable={{
            onRowDelete: async (intent) => deleteIntentHandler(intent),
          }}
        />
      </TableContainer>
    </Paper>
  );
}

export default IntentsTable;
