import { TableCell, TableHead, TableRow } from '@material-ui/core';
import React from 'react';
import { CommonTableHeadProps } from './types';

const CommonTableHead = ({
  alignments,
  headers,
  HeaderRow,
}: CommonTableHeadProps) => {
  const headerAlignments = alignments || [];

  return (
    <TableHead>
      {HeaderRow ? (
        <HeaderRow />
      ) : (
        headers && (
          <TableRow>
            {headers.map((header, index) => (
              <TableCell
                key={header || index}
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
