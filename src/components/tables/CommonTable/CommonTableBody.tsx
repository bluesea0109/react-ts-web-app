import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import { CommonTableBodyProps } from './types';

const CommonTableBody = ({
  rows,
  alignments,
  nonRecordError,
  Row,
}: CommonTableBodyProps) => {
  const bodyAlignments = alignments || [];

  return (
    <TableBody>
      {rows.length ? (
        rows.map((row, rowIndex) =>
          Row ? (
            <Row key={rowIndex} />
          ) : (
            <TableRow key={rowIndex} hover={true}>
              {row.map((col, colIndex) => (
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
