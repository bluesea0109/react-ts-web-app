import { TableBody, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import CommonTableRow, { StyledTableCell } from './CommonTableRow';
import { CommonTableBodyProps } from './types';

const CommonTableBody = ({
  actions,
  columns,
  rowsData,
  editable,
  localization,
  eventHandlers,
  components,
}: CommonTableBodyProps<object & { [index: string]: any }>) => {
  // prettier-ignore
  const columnCount = columns.length + ((editable !== undefined || actions !== undefined) ? 1 : 0);
  const StyledTableRow = components?.TableRow || CommonTableRow;

  return (
    <TableBody>
      {rowsData && rowsData.length ? (
        rowsData.map((rowData, rowIndex) => (
          <StyledTableRow
            key={rowIndex}
            rowIndex={rowIndex}
            actions={actions}
            columns={columns}
            rowData={rowData}
            editable={editable}
            columnCount={columnCount}
            localization={localization}
            onClick={eventHandlers?.onRowClick}
          />
        ))
      ) : (
        <TableRow>
          <StyledTableCell colSpan={columnCount}>
            <Typography align="center">
              {localization?.nonRecordError || 'No record can be found.'}
            </Typography>
          </StyledTableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default CommonTableBody;
