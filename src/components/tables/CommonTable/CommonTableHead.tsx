import { TableCell, TableHead, TableRow } from '@material-ui/core';
import React from 'react';
import { CommonTableHeadProps } from './types';

const CommonTableHead = ({
  alignments,
  columns,
  HeaderRow,
}: CommonTableHeadProps) => {
  const headerAlignments = alignments || [];

  return (
    <TableHead>
      {HeaderRow ? (
        <HeaderRow />
      ) : (
        columns && (
          <TableRow>
            {columns.map((header, index) => (
              <TableCell
                key={header.title || header.field || index}
                align={headerAlignments[index] || 'left'}
              />
            ))}
          </TableRow>
        )
      )}
    </TableHead>
  );
};

export default CommonTableHead;
