import { TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import { CommonTableHeadProps } from './types';

const CommonTableHead = ({
  columns,
  actions,
  editable,
  alignments,
  HeaderRow,
}: CommonTableHeadProps<object>) => {
  const headerAlignments = alignments || [];

  return (
    <TableHead>
      {HeaderRow ? (
        <HeaderRow columns={columns} />
      ) : (
        columns && (
          <TableRow>
            {columns.map((header, index) => (
              <TableCell
                key={header.title || header.field || index}
                align={headerAlignments[index] || 'left'}>
                {header.renderHeader ? (
                  header.renderHeader()
                ) : (
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: 'bold' }}>
                    {header.title}
                  </Typography>
                )}
              </TableCell>
            ))}
            {(editable || actions) && (
              <TableCell align="right">
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                  {'Actions'}
                </Typography>
              </TableCell>
            )}
          </TableRow>
        )
      )}
    </TableHead>
  );
};

export default CommonTableHead;
