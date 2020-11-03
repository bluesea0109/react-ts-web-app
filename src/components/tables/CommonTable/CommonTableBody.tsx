import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { CommonTableBodyProps, RowData } from './types';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const CommonTableBody = ({
  columns,
  rowsData,
  alignments,
  nonRecordError,
  Row,
}: CommonTableBodyProps<RowData>) => {
  const bodyAlignments = alignments || [];

  return (
    <TableBody>
      {rowsData.length ? (
        rowsData.map((rowData, rowIndex) => (
          Row ? (
            <Row key={rowIndex} rowData={rowData} index={rowIndex}/>
          ) : (
            <StyledTableRow key={rowIndex} hover={true}>
              {columns.map((column, colIndex) => (
                <TableCell
                  key={column.field}
                  align={bodyAlignments[colIndex] || 'left'}
                >
                  {rowData[column.field]}
                </TableCell>
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
