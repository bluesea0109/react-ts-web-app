import { IResponseOption } from '@bavard/agent-config';
import { Button, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect, useState } from 'react';
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import ConfirmDialog from '../../Utils/ConfirmDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      overflow: 'auto',
    },
    paper: {
      padding: theme.spacing(2),
    },
    pointer: {
      cursor: 'pointer',
    },
  }),
);

const DragHandle = SortableHandle(({ className }: { className: string | undefined }) => (
  <DragHandleIcon className={className}/>
));

interface SortableItemProps {
  text: string;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableItem = SortableElement(({
  text,
  onEdit,
  onDelete,
}: SortableItemProps) => {
  const classes = useStyles();

  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <ListItem ContainerComponent="div">
      <ListItemText primary={text} />
      <ListItemSecondaryAction>
        <ListItemIcon>
          <EditIcon className={classes.pointer} onClick={onEdit}/>
          <DeleteIcon className={classes.pointer} onClick={() => setConfirmOpen(true)}/>
          <DragHandle className={classes.pointer} />
        </ListItemIcon>
      </ListItemSecondaryAction>
      <ConfirmDialog
        title="Delete Item?"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={onDelete}
      >
        Are you sure you to delete this item?
      </ConfirmDialog>
    </ListItem>
  );
});

interface SortableListContainerProps {
  items: { text: string }[];
  onEditItem: (item: any) => void;
  onDeleteItem: (item: any) => void;
}

const SortableListContainer = SortableContainer(({
  items,
  onEditItem,
  onDeleteItem,
}: SortableListContainerProps) => (
  <List component="div">
    {items.map((item, index) => (
      <SortableItem
        key={index}
        index={index}
        text={item.text}
        onEdit={() => onEditItem(item)}
        onDelete={() => onDeleteItem(item)}
      />
    ))}
  </List>
));

interface SortableOptionsProps {
  options: IResponseOption[];
  setOptions: (updatedOptions: any[]) => void;
  onAdd: () => void;
  onEditOption: (option: IResponseOption) => void;
  onDeleteOption: (option: IResponseOption) => void | Promise<void>;
}

const SortableOptions = ({
  options,
  setOptions,
  onAdd,
  onEditOption,
  onDeleteOption,
}: SortableOptionsProps) => {
  const classes = useStyles();

  const [items, setItems] = useState<{ text: string }[]>(options.map(opt => ({ text: opt.text })));

  useEffect(() => {
    setItems(options.map(opt => ({ text: opt.text })));
  }, [options]);

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
    setOptions(arrayMove(options, oldIndex, newIndex));
  };

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        onClick={onAdd}
      >
        New Option
      </Button>
      <SortableListContainer
        items={items}
        onSortEnd={onSortEnd}
        useDragHandle={true}
        lockAxis="y"
        onEditItem={onEditOption}
        onDeleteItem={onDeleteOption}
      />
    </div>
  );
};

export default SortableOptions;
