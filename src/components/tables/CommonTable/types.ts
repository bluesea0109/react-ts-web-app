import React from 'react';
import { AlignmentType } from '../../types';

export type HeadersType = (string | null)[];

export type ItemType = any[];

export type RowsType = ItemType[];

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

export interface DataInterface {
  headers: HeadersType;
  rows: ItemType[];
}

export interface CommonTableHeadProps {
  headers?: HeadersType;
  HeaderRow?: React.ComponentType<any>;
  alignments?: AlignmentType[];
}

export interface CommonTableBodyProps {
  rows?: ItemType[];
  alignments?: AlignmentType[];
  nonRecordError?: string;
  Row?: React.ComponentType<any>;
}

export interface CommonTableFooterProps {
  isPaginated?: boolean;
  pagination?: PaginationType;
}

// prettier-ignore
export interface CommonTableProps {
  data: DataInterface;
  alignments?: AlignmentType[];
  nonRecordError?: string;
  Row?: React.ComponentType<any>;
  pagination?: PaginationAttribute;
}
