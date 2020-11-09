import React from 'react';
import { AlignmentType } from '../../types';

// @TODO: Further investigation of RowData: JAMES
export interface HeaderType<RowData extends object> {
  title: string;
  field: keyof RowData | string;
  alignRow?: AlignmentType;
  alignHeader?: AlignmentType;
  renderRow?: (rowData: RowData | any) => any;
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

export type EditableAttribute<RowData extends object> = {
  isEditable?: boolean | ((rowData: RowData) => boolean);
  isDeleteable?: boolean | ((rowData: RowData) => boolean);
  onRowAdd?: (newData: RowData) => Promise<any> | void;
  onRowUpdate?: (newData: RowData | any) => Promise<any> | void;
  onRowDelete?: (rowData: RowData | any) => Promise<any> | void;
};

// @TODO: JAMES
export type LocalizationAttribute = {};

export interface DataInterface<RowData extends object> {
  columns: HeaderType<RowData>[];
  rowsData: RowsType<RowData>;
}

export interface CommonTableHeadProps<RowData extends object> {
  columns?: HeaderType<RowData>[];
  editable?: EditableAttribute<RowData>;
  alignments?: AlignmentType[];
  HeaderRow?: React.ComponentType<any>;
}

export interface CommonTableBodyProps<RowData extends object> {
  columns: HeaderType<RowData>[];
  rowsData: RowData[];
  editable?: EditableAttribute<RowData>;
  nonRecordError?: string;
  Row?: React.ComponentType<any>;
}

export interface CommonTableFooterProps {
  pagination?: PaginationType;
  isPaginated?: boolean;
  columnCount?: number;
}

// prettier-ignore
export interface CommonTableProps<RowData extends object> {
  data: DataInterface<RowData>;
  editable?: EditableAttribute<RowData>;
  pagination?: PaginationAttribute;
  localization?: LocalizationAttribute;
  nonRecordError?: string;
  Row?: React.ComponentType<any>;
  HeaderRow?: React.ComponentType<any>;
}
