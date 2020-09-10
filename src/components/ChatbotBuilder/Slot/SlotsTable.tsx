import { Button, Paper, TableContainer } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Edit } from '@material-ui/icons';
import _ from 'lodash';
import MaterialTable, { Column } from 'material-table';
import React from 'react';
import { AnyAction, ISlot } from '../../../models/chatbot-service';

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

interface SlotsTableProps {
  onEditSlot: (id: number) => void;
  onDeleteSlot: (id: number) => void | Promise<void>;
  slots: ISlot[];
  loading: boolean;
  onAdd: () => void;
}

function SlotsTable({
  slots,
  loading,
  onAdd,
  onEditSlot,
  onDeleteSlot,
}: SlotsTableProps) {
  const classes = useStyles();
  const columns: Column<ISlot>[] = [
    { title: 'Name', field: 'name', editable: 'never' },
    { title: 'Type', field: 'type', editable: 'never' },
  ];

  const deleteSlotHandler = async (id: number) => {
    await onDeleteSlot(id);
  };

  return (
    <Paper className={classes.paper}>
      <TableContainer component={Paper} aria-label="Slots">
        <MaterialTable
          isLoading={loading}
          title={
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              onClick={onAdd}>
              Add New Slot
            </Button>
          }
          columns={columns}
          data={_.cloneDeep(slots)}
          options={{
            actionsColumnIndex: -1,
            paging: true,
            pageSize: 10,
          }}
          localization={{
            body: {
              editRow: {
                deleteText: 'Are you sure to delete this slot?',
              },
            },
          }}
          actions={[
            {
              icon: (props: any) => <Edit />,
              tooltip: 'Edit Slot',
              onClick: (_, rowData) => onEditSlot((rowData as ISlot).id),
            },
          ]}
          editable={{
            onRowDelete: (oldData) => deleteSlotHandler((oldData as ISlot).id),
          }}
        />
      </TableContainer>
    </Paper>
  );
}

export default SlotsTable;
