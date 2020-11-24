import { ISlot } from '@bavard/agent-config';
import { CommonTable } from '@bavard/react-components';
import { Button, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
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
  slots: ISlot[];
  onAdd: () => void;
  onEditSlot: (slot: ISlot) => void;
  onDeleteSlot: (slot: ISlot) => void;
}

function SlotsTable({
  slots,
  onAdd,
  onEditSlot,
  onDeleteSlot,
}: SlotsTableProps) {
  const classes = useStyles();
  const columns = [
    { title: 'Name', field: 'name' },
    { title: 'Type', field: 'type' },
  ];

  return (
    <Paper className={classes.paper}>
      <Button variant="contained" color="primary" onClick={onAdd}>
        Add New Slot
      </Button>
      <CommonTable
        data={{
          columns,
          rowsData: slots,
        }}
        pagination={{
          rowsPerPage: 10,
        }}
        editable={{
          isEditable: true,
          isDeleteable: true,
          onRowUpdate: (rowData: ISlot) => onEditSlot(rowData),
          onRowDelete: (rowData: ISlot) => onDeleteSlot(rowData),
        }}
      />
    </Paper>
  );
}

export default SlotsTable;
