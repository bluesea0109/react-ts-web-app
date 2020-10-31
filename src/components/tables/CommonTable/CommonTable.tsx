import { Table } from '@material-ui/core';
import React from 'react';
import CommonTableBody from './CommonTableBody';
import CommonTableHead from './CommonTableHead';
import { CommonTableProps } from './types';

const CommonTable = ({
  alignments,
  data,
  nonRecordError,
  Row,
}: CommonTableProps) => {
  return (
    <Table>
      <CommonTableHead alignments={alignments} headers={data.headers} />
      <CommonTableBody
        alignments={alignments}
        rows={data.rows}
        Row={Row}
        nonRecordError={nonRecordError}
      />
    </Table>
  );
};

export default CommonTable;
