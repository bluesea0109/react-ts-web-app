import {
  Box,
  Button,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import { Check, Close, Delete, Edit } from '@material-ui/icons';
import _ from 'lodash';
import React, { Fragment, useState } from 'react';
import { CommonTableRowProps } from './types';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },

    '&:nth-of-type(odd)': {
      backgroundColor: 'rgba(0, 0, 100, 0.16)',

      '&:hover': {
        backgroundColor: 'rgba(0, 0, 100, 0.12)',
      },
    },

    '& a': {
      color: theme.palette.primary.dark,
      textDecoration: 'none',

      '&:hover': {
        textDecoration: 'underline',
      },
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
    boxContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  }),
);

const CommonTableRow = ({
  actions,
  columns,
  rowData,
  rowIndex,
  editable,
  columnCount,
  onClick,
  localization,
}: CommonTableRowProps<object>) => {
  const classes = useStyles();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const onConfirmDelete = () => {
    editable?.onRowDelete?.(rowData);
    setConfirmDelete(false);
  };

  return (
    <StyledTableRow
      hover={true}
      onClick={onClick ? () => onClick(rowData) : undefined}>
      {confirmDelete ? (
        <StyledTableCell colSpan={columnCount}>
          <Box className={classes.boxContainer}>
            <Typography>Are you sure to delete this record?</Typography>
            <Box>
              <Button onClick={onConfirmDelete}>
                <Check />
              </Button>
              <Button onClick={() => setConfirmDelete(false)}>
                <Close />
              </Button>
            </Box>
          </Box>
        </StyledTableCell>
      ) : (
        <Fragment>
          {columns.map((column, columnIndex) => (
            <StyledTableCell
              key={column.field || columnIndex}
              align={column.alignRow || 'left'}>
              {column.renderRow
                ? column.renderRow(rowData)
                : column.field && _.get(rowData, column.field)}
            </StyledTableCell>
          ))}

          {editable && !actions && (
            <StyledTableCell align="right">
              {editable.isEditable && (
                <Button
                  className={classes.button}
                  onClick={() => editable.onRowUpdate?.(rowData)}>
                  <Edit />
                </Button>
              )}
              {editable.isDeleteable && editable.onRowDelete && (
                <Button
                  className={classes.button}
                  onClick={() => setConfirmDelete(true)}>
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
        </Fragment>
      )}
    </StyledTableRow>
  );
};

export default CommonTableRow;
