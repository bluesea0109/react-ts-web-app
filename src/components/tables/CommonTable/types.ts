import React from 'react';
import { AlignmentType } from '../../types';

export type HeaderType = {
  title: string;
  field: string;
  render?: (rowData: RowData) => any;
};

export type RowData = object;

export type RowsType<RowData> = RowData[];

export type HeadersType = HeaderType[];

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

export interface DataInterface<RowData> {
  columns: HeadersType;
  rowsData: RowsType<RowData>;
}

export interface CommonTableHeadProps {
  columns?: HeadersType;
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
