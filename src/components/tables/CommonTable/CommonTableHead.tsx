import { TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { CommonTableHeadProps } from './types';

const NonBorderedCell = withStyles((theme) => ({
  root: {
    border: 'none',
  },
}))(TableCell);

const CommonTableHead = ({
  columns,
  actions,
  editable,
  alignments,
  localization,
  components,
}: CommonTableHeadProps<object>) => {
  const headerAlignments = alignments || [];

  const StyledTableCell = components?.TableHeaderCell || NonBorderedCell;

  return (
    <TableHead>
      {components?.TableHeaderRow ? (
        <components.TableHeaderRow columns={columns} />
      ) : (
        columns && (
          <TableRow>
            {columns.map((header, index) => (
              <StyledTableCell
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
              </StyledTableCell>
            ))}
            {(editable || actions) && (
              <StyledTableCell align="right">
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                  {localization?.actionsText === ''
                    ? ''
                    : localization?.actionsText || 'Actions'}
                </Typography>
              </StyledTableCell>
            )}
          </TableRow>
        )
      )}
    </TableHead>
  );
};

export default CommonTableHead;
