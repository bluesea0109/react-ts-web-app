import React from 'react';
import { AlignmentType } from '../../types';

export type RowData = object &  {[index: string]: any};

export interface HeaderType<RowData extends object> {
  title: string;
  field: keyof RowData | string;
  render?: (rowData: RowData) => any;
}

export type RowsType<RowData> = RowData[];

export type HeadersType<RowData extends object> = HeaderType<RowData>[];

export interface PaginationAttribute {
  rowsPerPage?: number;
  colSpan?: number;
}

export interface PaginationType extends PaginationAttribute {
  page?: number;
  rowCount?: number;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => void;
}

export interface DataInterface<RowData extends object> {
  columns: HeadersType<RowData>;
  rowsData: RowsType<RowData>;
}

export interface CommonTableHeadProps<RowData extends object> {
  columns?: HeadersType<RowData>;
  HeaderRow?: React.ComponentType<any>;
  alignments?: AlignmentType[];
}

export interface CommonTableBodyProps<RowData extends object> {
  data: DataInterface<RowData>;
  alignments?: AlignmentType[];
  nonRecordError?: string;
  Row?: React.ComponentType<any>;
}

export interface CommonTableFooterProps {
  isPaginated?: boolean;
  pagination?: PaginationType;
}

// prettier-ignore
export interface CommonTableProps<RowData extends object> {
  data: DataInterface<RowData>;
  alignments?: AlignmentType[];
  nonRecordError?: string;
  Row?: React.ComponentType<any>;
  pagination?: PaginationAttribute;
}
