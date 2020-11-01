import { AlignmentType } from '../../types';

export type HeadersType = (string | null)[];

export type ItemType = any[];

export type RowsType = ItemType[];

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
  rows: RowsType;
  alignments?: AlignmentType[];
  nonRecordError?: string;
  Row?: React.ComponentType<any>;
}

export interface CommonTableProps
  extends CommonTableHeadProps,
    CommonTableBodyProps {
  nonRecordError?: string;
  data: DataInterface;
}
