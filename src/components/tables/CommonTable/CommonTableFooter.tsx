import { TableFooter, TablePagination, TableRow } from '@material-ui/core';
import React from 'react';
import { CommonTableFooterProps } from './types';

const CommonTableFooter = ({
  isPaginated,
  pagination,
}: CommonTableFooterProps) => {
  return (
    <TableFooter>
      {isPaginated && pagination && (
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[pagination.rowsPerPage || 10]}
            colSpan={pagination.colSpan || 2}
            count={pagination.rowCount || 0}
            rowsPerPage={pagination.rowsPerPage || 10}
            page={pagination.page || 0}
            SelectProps={{
              native: true,
            }}
            onChangePage={pagination.handleChangePage}
          />
        </TableRow>
      )}
    </TableFooter>
  );
};

export default CommonTableFooter;
