import {
  Button,
  Paper,
  TableContainer, Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import 'firebase/auth';
import MaterialTable, { Column } from 'material-table';
import React from 'react';
import { AnyAction, IIntent } from '../../../models/chatbot-service';
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

interface IntentsTableProps {
  onEditIntent: (id: number) => void;
  onDeleteIntent: (id: number) => void | Promise<void>;
  intents: IIntent[];
  actions: AnyAction[];
  loading: boolean;
  onAdd: () => void;
}

function IntentsTable({ intents, actions, loading, onAdd, onEditIntent, onDeleteIntent }: IntentsTableProps) {
  const classes = useStyles();
  const columns: Column<IIntent>[] = [
    { title: 'Intent id', field: 'id', editable: 'never' },
    {
      title: 'Name',
      field: 'value',
      editable: 'never'
    },
    {
      title: 'Default Action',
      render: rowData => actions.find(a => a.id === rowData.defaultAction)?.name ?? <Typography style={{ color: "#808080" }}>N/A</Typography>,
      editable: 'never'
    },
  ];

  const deleteIntentHandler = async (intentId: number) => {
    await onDeleteIntent(intentId);
  };

  return (
    <Paper className={classes.paper}>
      <TableContainer component={Paper} aria-label="Agents">
        <MaterialTable
          isLoading={loading}
          title={
            <Button disabled={loading} variant="contained" color="primary" onClick={onAdd}>Add New Intent</Button>
          }
          columns={columns}
          data={intents ?? []}
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
              icon: (props: any) => <Edit />,
              tooltip: 'Edit Intent',
              onClick: (event, rowData) => {
                const data = rowData as IIntent;
                onEditIntent(data.id);
              },
            },
          ]}
          editable={{
            onRowDelete: async (oldData) => {
              const dataId = oldData.id;
              await deleteIntentHandler(dataId);
            },
          }}
        />
      </TableContainer>
    </Paper>
  );
}

export default IntentsTable;
