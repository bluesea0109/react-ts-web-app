import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import { CommonTableBodyProps, RowData } from './types';

const CommonTableBody = ({
  data,
  alignments,
  nonRecordError,
  Row,
}: CommonTableBodyProps<RowData>) => {
  const bodyAlignments = alignments || [];

  return (
    <TableBody>
      {data?.rowsData.length ? (
        data.rowsData.map((rowData, rowIndex) =>
          Row ? (
            <Row key={rowIndex} rowData={rowData} />
          ) : (
            <TableRow hover={true}>
              {data.columns.map((column, colIndex) => (
                <TableCell
                  key={column.field}
                  align={bodyAlignments[colIndex] || 'left'}>
                  {rowData[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ),
        )
      ) : (
        <Typography align="center">
          {nonRecordError ?? 'No record can be found.'}
        </Typography>
      )}
    </TableBody>
  );
};

export default CommonTableBody;
