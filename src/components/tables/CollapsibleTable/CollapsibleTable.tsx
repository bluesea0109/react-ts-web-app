import { Grid } from '@material-ui/core';
import React from 'react';
import CollapsibleItem from './CollapsibleItem';
import { ItemInterface } from './types';

interface CollapsibleTableProps<ItemInterface> {
  items: ItemInterface[];
  defaultCollapsed?: boolean;
  onEditItem?: (item: ItemInterface) => void;
  onDeleteItem?: (item: ItemInterface) => void;
  onBulkUpdate?: (items: ItemInterface[]) => void;
  ItemRow: React.ComponentType<any>;
  ItemDetail: React.ComponentType<any>;
}

const CollapsibleTable = ({
  items,
  defaultCollapsed,
  onEditItem,
  onDeleteItem,
  onBulkUpdate,
  ItemRow,
  ItemDetail,
}: CollapsibleTableProps<ItemInterface>) => {
  return (
    <Grid container={true}>
      {items.map((item, index) => (
        <CollapsibleItem
          key={index}
          index={index}
          item={item}
          defaultCollapsed={defaultCollapsed}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
          onBulkUpdate={onBulkUpdate}
          ItemRow={ItemRow}
          ItemDetail={ItemDetail}
        />
      ))}
    </Grid>
  );
};

export default CollapsibleTable;
