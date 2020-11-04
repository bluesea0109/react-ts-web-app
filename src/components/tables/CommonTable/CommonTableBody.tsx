import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
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
    fontSize: 14,
    paddingTop: 5,
    paddingBottom: 5,
  },
}))(TableCell);

const CommonTableBody = ({
  columns,
  rowsData,
  nonRecordError,
  Row,
}: CommonTableBodyProps<object & {[index: string]: any}>) => {
  return (
    <TableBody>
      {rowsData.length ? (
        rowsData.map((rowData, rowIndex) => (
          Row ? (
            <Row key={rowIndex} rowData={rowData} index={rowIndex}/>
          ) : (
            <StyledTableRow key={rowIndex} hover={true}>
              {columns.map(column => (
                <StyledTableCell
                  key={column.field}
                  align={column.alignRow || 'left'}
                >
                  {column.renderRow ? column.renderRow(rowData) : rowData[column.field]}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          )
        ))
      ) : (
        <Typography align="center">
          {nonRecordError ?? 'No record can be found.'}
        </Typography>
      )}
    </TableBody>
  );
};

export default CommonTableBody;
