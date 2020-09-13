import { ISlot } from '@bavard/agent-config';
import { Button, Paper, TableContainer } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Edit } from '@material-ui/icons';
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

interface SlotsTableProps {
  onEditSlot: (slot: ISlot) => void;
  onDeleteSlot: (slot: ISlot) => void | Promise<void>;
  slots: ISlot[];
  onAdd: () => void;
}

function SlotsTable({
  slots,
  onAdd,
  onEditSlot,
  onDeleteSlot,
}: SlotsTableProps) {
  const classes = useStyles();
  const columns: Column<ISlot>[] = [
    { title: 'Name', field: 'name', editable: 'never' },
    { title: 'Type', field: 'type', editable: 'never' },
  ];

  const deleteSlotHandler = async (slot: ISlot) => {
    await onDeleteSlot(slot);
  };

  return (
    <Paper className={classes.paper}>
      <TableContainer component={Paper} aria-label="Slots">
        <MaterialTable
          title={
            <Button
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
              onClick: (_, rowData) => onEditSlot((rowData as ISlot)),
            },
          ]}
          editable={{
            onRowDelete: (slot) => deleteSlotHandler((slot as ISlot)),
          }}
        />
      </TableContainer>
    </Paper>
  );
}

export default SlotsTable;
