import { Grid } from '@material-ui/core';
import React from 'react';
import CollapsibleItem from './CollapsibleItem';
import { ItemInterface } from './types';

interface CollapsibleTableProps<ItemInterface> {
  items: ItemInterface[];
  onEditItem?: (item: ItemInterface) => void;
  onDeleteItem?: (item: ItemInterface) => void;
  ItemRow: React.ComponentType<any>;
  ItemDetail: React.ComponentType<any>;
}

const CollapsibleTable = ({
  items,
  onEditItem,
  onDeleteItem,
  ItemRow,
  ItemDetail,
}: CollapsibleTableProps<ItemInterface>) => {
  return (
    <Grid container={true}>
      {items.map((item) => (
        <CollapsibleItem
          key={item.name}
          item={item}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
          ItemRow={ItemRow}
          ItemDetail={ItemDetail}
        />
      ))}
    </Grid>
  );
};

export default CollapsibleTable;
