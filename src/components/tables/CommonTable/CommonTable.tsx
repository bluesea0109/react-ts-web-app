import { Table } from '@material-ui/core';
import React, { useState } from 'react';
import CommonTableBody from './CommonTableBody';
import CommonTableFooter from './CommonTableFooter';
import CommonTableHead from './CommonTableHead';
import { CommonTableProps } from './types';

const CommonTable = ({
  alignments,
  data,
  nonRecordError,
  Row,
  pagination,
}: CommonTableProps) => {
  const [page, setPage] = useState(0);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => {
    setPage(page);
  };

  return (
    <Table>
      <CommonTableHead alignments={alignments} headers={data.headers} />
      <CommonTableBody
        alignments={alignments}
        rows={data.rows}
        Row={Row}
        nonRecordError={nonRecordError}
      />
      <CommonTableFooter
        isPaginated={!!pagination}
        pagination={{ ...pagination, handleChangePage }}
      />
    </Table>
  );
};

export default CommonTable;
