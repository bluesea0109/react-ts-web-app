import {
  TableFooter,
  TableCell,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import React from 'react';
import { CommonTableFooterProps } from './types';

const CommonTableFooter = ({
  pagination,
  columnCount,
  isPaginated,
  components,
}: CommonTableFooterProps) => {
  return (
    <TableFooter>
      {((isPaginated && pagination) || components?.TableFooter) && (
        <TableRow>
          {components?.TableFooter && (
            <TableCell>
              <components.TableFooter />
            </TableCell>
          )}
          {pagination && (
            <TablePagination
              rowsPerPageOptions={[pagination.rowsPerPage || 10]}
              colSpan={pagination.colSpan || columnCount || 0}
              count={pagination.rowCount || 0}
              rowsPerPage={pagination.rowsPerPage || 10}
              page={pagination.page || 0}
              SelectProps={{
                native: true,
              }}
              onChangePage={pagination.handleChangePage}
            />
          )}
        </TableRow>
      )}
    </TableFooter>
  );
};

export default CommonTableFooter;
