import { IResponseOption } from '@bavard/agent-config';
import { List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import React, { useEffect, useState } from 'react';
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => (
  <ListItemIcon>
    <DragHandleIcon />
  </ListItemIcon>
));

const SortableItem = SortableElement(({
  text,
}: {
  text: string,
}) => (
  <ListItem ContainerComponent="div">
    <ListItemText primary={text} />
    <ListItemSecondaryAction>
      <DragHandle />
    </ListItemSecondaryAction>
  </ListItem>
));

const SortableListContainer = SortableContainer(({ items }: { items: { text: string }[]}) => (
  <List component="div">
    {items.map(({ text }, index) => (
      <SortableItem key={index} index={index} text={text} />
    ))}
  </List>
));

const SortableOptions = ({
  options,
  setOptions,
}: {
  options: IResponseOption[],
  setOptions: (updatedOptions: any[]) => void,
}) => {
  const [items, setItems] = useState<{ text: string }[]>(options.map(opt => ({ text: opt.text })));

  useEffect(() => {
    setItems(options.map(opt => ({ text: opt.text })));
  }, [options]);

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
    setOptions(arrayMove(options, oldIndex, newIndex));
  };

  return (
    <SortableListContainer
      items={items}
      onSortEnd={onSortEnd}
      useDragHandle={true}
      lockAxis="y"
    />
  );
};

export default SortableOptions;
