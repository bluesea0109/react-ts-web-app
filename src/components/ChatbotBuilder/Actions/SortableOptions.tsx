import { List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import React, { useEffect, useState } from 'react';
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import { IUserResponseOption } from '../../../models/chatbot-service';

const DragHandle = SortableHandle(() => (
  <ListItemIcon>
    <DragHandleIcon />
  </ListItemIcon>
));

const SortableItem = SortableElement(({ text }: { text: string }) => (
  <ListItem ContainerComponent="div">
    <ListItemText primary={text} />
    <ListItemSecondaryAction>
      <DragHandle />
    </ListItemSecondaryAction>
  </ListItem>
));

const SortableListContainer = SortableContainer(({ items }: { items: { id: number, text: string }[]}) => (
  <List component="div">
    {items.map(({ id, text }, index) => (
      <SortableItem key={id} index={index} text={text} />
    ))}
  </List>
));

const SortableOptions = ({ options, setOptions }: { options: IUserResponseOption[], setOptions: (updatedOptions: any[]) => void }) => {
  const [items, setItems] = useState<{ id: number, text: string }[]>(options.map(opt => ({ id: opt.id, text: opt.text })));

  console.log(options);

  useEffect(() => {
    setItems(options.map(opt => ({ id: opt.id, text: opt.text })));
  }, [options]);

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
    // setItems(items => arrayMove(items, oldIndex, newIndex));
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
