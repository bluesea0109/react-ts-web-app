import { Button, TableCell, TableRow } from '@material-ui/core';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import { Delete, Edit } from '@material-ui/icons';
import _ from 'lodash';
import React from 'react';
import { CommonTableRowProps } from './types';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: 'wihte',
  },
  body: {
    height: 40,
    fontSize: 14,
    paddingTop: 5,
    paddingBottom: 5,
  },
  root: {
    border: 'none',
  },
}))(TableCell);

const useStyles = makeStyles((theme) =>
  createStyles({
    button: {
      padding: 0,
      minWidth: 48,
    },
  }),
);

const CommonTableRow = ({
  actions,
  columns,
  rowData,
  editable,
  localization,
}: CommonTableRowProps<object>) => {
  const classes = useStyles();

  return (
    <StyledTableRow hover={true}>
      {columns.map((column) => (
        <StyledTableCell key={column.field} align={column.alignRow || 'left'}>
          {column.renderRow
            ? column.renderRow(rowData)
            : _.get(rowData, column.field)}
        </StyledTableCell>
      ))}

      {editable && !actions && (
        <StyledTableCell align="right">
          {editable.isEditable && editable.onRowUpdate && (
            <Button
              className={classes.button}
              // @ts-ignore
              onClick={() => editable.onRowUpdate(rowData)}>
              <Edit />
            </Button>
          )}
          {editable.isDeleteable && editable.onRowDelete && (
            <Button
              className={classes.button}
              // @ts-ignore
              onClick={() => editable.onRowDelete(rowData)}>
              <Delete />
            </Button>
          )}
        </StyledTableCell>
      )}

      {!editable && actions && (
        <StyledTableCell align="right">
          {actions.map((action, index) => (
            <Button key={index} onClick={(e) => action.onClick(e, rowData)}>
              {action.icon && <action.icon />}
            </Button>
          ))}
        </StyledTableCell>
      )}
    </StyledTableRow>
  );
};

export default CommonTableRow;
