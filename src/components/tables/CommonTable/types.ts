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

export interface ActionInterface<RowData extends object> {
  icon: React.ComponentType<any>;
  tooltip: React.ReactNode;
  onClick: (
    event: React.MouseEvent<HTMLButtonElement> | any,
    rowData: RowData,
  ) => void;
}

export interface PaginationInterface {
  asyncPage?: number;
  colSpan?: number;
  isAsync?: boolean;
  asyncTotalCount?: number;
  rowsPerPage?: number;
  onUpdatePage?: (page: number) => void;
}

export interface PaginationType extends PaginationInterface {
  page?: number;
  rowCount?: number;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => void;
}

export interface EditableInterface<RowData extends object> {
  isEditable?: boolean | ((rowData: RowData) => boolean);
  isDeleteable?: boolean | ((rowData: RowData) => boolean);
  onRowAdd?: (newData: RowData) => Promise<any> | void;
  onRowUpdate?: (newData: RowData | any) => Promise<any> | void;
  onRowDelete?: (rowData: RowData | any) => Promise<any> | void;
}

export interface LocalizationInterface {
  actionsText?: string;
  nonRecordError?: string;
}

export interface DataInterface<RowData extends object> {
  columns: HeaderType<RowData>[];
  rowsData?: RowsType<RowData>;
}

export type ActionsInterface<RowData extends object> = ActionInterface<
  RowData
>[];

export interface CommonTableHeadProps<RowData extends object> {
  columns?: HeaderType<RowData>[];
  actions?: ActionsInterface<RowData>;
  editable?: EditableInterface<RowData>;
  alignments?: AlignmentType[];
  localization?: LocalizationInterface;
  HeaderRow?: React.ComponentType<any>;
}

export interface CommonTableBodyProps<RowData extends object> {
  actions?: ActionsInterface<RowData>;
  columns: HeaderType<RowData>[];
  rowsData?: RowData[];
  editable?: EditableInterface<RowData>;
  localization?: LocalizationInterface;
  Row?: React.ComponentType<any>;
}

export interface CommonTableRowProps<RowData extends object> {
  actions?: ActionsInterface<RowData>;
  columns: HeaderType<RowData>[];
  rowData: RowData;
  editable?: EditableInterface<RowData>;
  columnCount: number;
  localization?: LocalizationInterface;
  Row?: React.ComponentType<any>;
}

export interface CommonTableFooterProps {
  pagination?: PaginationType;
  isPaginated?: boolean;
  columnCount?: number;
}

export interface ComponentListInterface {
  Toolbar?: React.ComponentType<any>;
}

// prettier-ignore
export interface CommonTableProps<RowData extends object> {
  title?: React.ReactNode;
  actions?: ActionsInterface<RowData>;
  data: DataInterface<RowData>;
  editable?: EditableInterface<RowData>;
  pagination?: PaginationInterface;
  localization?: LocalizationInterface;
  components?: ComponentListInterface;
  Row?: React.ComponentType<any>;
  HeaderRow?: React.ComponentType<any>;
}
