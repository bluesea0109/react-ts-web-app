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
              {Object.values(rowData).map((col, colIndex) => (
                <TableCell
                  key={colIndex}
                  align={bodyAlignments[colIndex] || 'left'}>
                  {col}
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
