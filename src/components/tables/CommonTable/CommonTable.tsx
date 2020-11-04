import { Table } from '@material-ui/core';
import React, { useMemo, useState } from 'react';
import CommonTableBody from './CommonTableBody';
import CommonTableFooter from './CommonTableFooter';
import CommonTableHead from './CommonTableHead';
import { CommonTableProps } from './types';

const CommonTable = ({
  data,
  nonRecordError,
  pagination,
  Row,
  HeaderRow,
}: CommonTableProps<object>) => {
  const [page, setPage] = useState(0);

  const pageItems = useMemo(() => {
    if (!pagination) { return data.rowsData; }
    const rowsPerPage = pagination.rowsPerPage || 20;

    return data.rowsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [page, pagination, data.rowsData]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => {
    setPage(page);
  };

  return (
    <Table>
      <CommonTableHead
        columns={data.columns}
        HeaderRow={HeaderRow}
      />
      <CommonTableBody
        rowsData={pageItems}
        columns={data.columns}
        nonRecordError={nonRecordError}
        Row={Row}
      />
      <CommonTableFooter
        isPaginated={!!pagination}
        pagination={{
          ...pagination,
          page,
          rowCount: data.rowsData.length,
          handleChangePage,
        }}
      />
    </Table>
  );
};

export default CommonTable;
