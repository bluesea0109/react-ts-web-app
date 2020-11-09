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
  Row,
}: CommonTableBodyProps<object & { [index: string]: any }>) => {
  // prettier-ignore
  const columnCount = columns.length + ((editable !== undefined || actions !== undefined) ? 1 : 0);

  return (
    <TableBody>
      {rowsData && rowsData.length ? (
        rowsData.map((rowData, rowIndex) =>
          Row ? (
            <Row key={rowIndex} rowData={rowData} index={rowIndex} />
          ) : (
            <CommonTableRow
              key={rowIndex}
              actions={actions}
              columns={columns}
              rowData={rowData}
              editable={editable}
              localization={localization}
            />
          ),
        )
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
