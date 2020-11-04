import React from 'react';
import { AlignmentType } from '../../types';

export interface HeaderType<RowData extends object> {
  title: string;
  field: keyof RowData | string;
  alignRow?: AlignmentType;
  alignHeader?: AlignmentType;
  renderRow?: (rowData: RowData|any) => any;
  renderHeader?: () => any;
}

export type RowsType<RowData extends object> = RowData[];

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
  columns: HeaderType<RowData>[];
  rowsData: RowsType<RowData>;
}

export interface CommonTableHeadProps<RowData extends object> {
  columns?: HeaderType<RowData>[];
  alignments?: AlignmentType[];
  HeaderRow?: React.ComponentType<any>;
}

export interface CommonTableBodyProps<RowData extends object> {
  rowsData: RowData[];
  columns: HeaderType<RowData>[];
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
  pagination?: PaginationAttribute;
  nonRecordError?: string;
  Row?: React.ComponentType<any>;
  HeaderRow?: React.ComponentType<any>;
}
