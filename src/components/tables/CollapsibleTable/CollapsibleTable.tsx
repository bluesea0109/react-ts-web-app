import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import CollapsibleItem from './CollapsibleItem';
import { ItemInterface } from './types';

interface CollapsibleTableProps<ItemInterface> {
  items: ItemInterface[];
  defaultCollapsed?: boolean;
  onEditItem?: (item: ItemInterface) => void;
  onUpdateItem?: (index: number, item: ItemInterface) => void;
  onDeleteItem?: (item: ItemInterface) => void;
  onBulkUpdate?: (items: ItemInterface[]) => void;
  ItemRow: React.ComponentType<any>;
  ItemDetail: React.ComponentType<any>;
  otherProps?: object;
}

const CollapsibleTable = ({
  items,
  defaultCollapsed,
  onEditItem,
  onUpdateItem,
  onDeleteItem,
  onBulkUpdate,
  ItemRow,
  ItemDetail,
  otherProps,
}: CollapsibleTableProps<ItemInterface>) => {
  const [selected, setSelected] = useState(-1)
  return (
    <Grid container={true}>
      {items.map((item, index) => (
        <CollapsibleItem
          key={index}
          index={index}
          item={item}
          defaultCollapsed={defaultCollapsed}
          onEdit={onEditItem}
          onUpdate={onUpdateItem}
          onDelete={onDeleteItem}
          onBulkUpdate={onBulkUpdate}
          ItemRow={ItemRow}
          isOpened={selected === index}
          onClickItem={() => setSelected(index)}
          ItemDetail={ItemDetail}
          otherProps={otherProps}
        />
      ))}
    </Grid>
  );
};

export default CollapsibleTable;
