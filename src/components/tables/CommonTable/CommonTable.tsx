import { Table } from '@material-ui/core';
import React, { useState } from 'react';
import CommonTableBody from './CommonTableBody';
import CommonTableFooter from './CommonTableFooter';
import CommonTableHead from './CommonTableHead';
import { CommonTableProps, RowData } from './types';

const CommonTable = ({
  data,
  alignments,
  nonRecordError,
  pagination,
  Row,
}: CommonTableProps<RowData>) => {
  const [page, setPage] = useState(0);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => {
    setPage(page);
  };

  return (
    <Table>
      <CommonTableHead alignments={alignments} columns={data.columns} />
      <CommonTableBody
        data={data}
        alignments={alignments}
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
