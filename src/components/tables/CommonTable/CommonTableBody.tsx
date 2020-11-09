import {
  Button,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Delete, Edit } from '@material-ui/icons';
import _ from 'lodash';
import React from 'react';
import { CommonTableBodyProps } from './types';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: 'wihte',
  },
  body: {
    height: 40,
    fontSize: 14,
    paddingTop: 5,
    paddingBottom: 5,
  },
}))(TableCell);

const CommonTableBody = ({
  columns,
  rowsData,
  editable,
  nonRecordError,
  Row,
}: CommonTableBodyProps<object & { [index: string]: any }>) => {
  return (
    <TableBody>
      {rowsData.length ? (
        rowsData.map((rowData, rowIndex) =>
          Row ? (
            <Row key={rowIndex} rowData={rowData} index={rowIndex} />
          ) : (
            <StyledTableRow key={rowIndex} hover={true}>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.field}
                  align={column.alignRow || 'left'}>
                  {column.renderRow
                    ? column.renderRow(rowData)
                    : _.get(rowData, column.field)}
                </StyledTableCell>
              ))}

              {editable && (
                <StyledTableCell align="right">
                  {editable.isEditable && editable.onRowUpdate && (
                    // @ts-ignore
                    <Button onClick={() => editable.onRowUpdate(rowData)}>
                      <Edit />
                    </Button>
                  )}
                  {editable.isDeleteable && editable.onRowDelete && (
                    // @ts-ignore
                    <Button onClick={() => editable.onRowDelete(rowData)}>
                      <Delete />
                    </Button>
                  )}
                </StyledTableCell>
              )}
            </StyledTableRow>
          ),
        )
      ) : (
        <TableRow>
          <StyledTableCell colSpan={4}>
            <Typography align="center">
              {nonRecordError ?? 'No record can be found.'}
            </Typography>
          </StyledTableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default CommonTableBody;
