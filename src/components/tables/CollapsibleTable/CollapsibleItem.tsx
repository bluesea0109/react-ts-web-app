import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
} from '@material-ui/core';
import React, { useState } from 'react';
import { ItemInterface } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      marginBttom: theme.spacing(2),
    },
    paper: {
      width: '100%',
    },
    header: {
      padding: '4px 8px 4px 4px',
    },
  }),
);

interface CollapsibleItemProps<ItemInterface> {
  item: ItemInterface;
  index?: number;
  defaultCollapsed?: boolean;
  onEdit?: (item: ItemInterface) => void;
  onUpdate?: (index: number, item: ItemInterface) => void;
  onDelete?: (index: number) => void;
  onBulkUpdate?: (items: ItemInterface[]) => void;
  ItemRow: React.ComponentType<any>;
  ItemDetail: React.ComponentType<any>;
}

const CollapsibleItem = ({
  item,
  index,
  defaultCollapsed,
  onEdit,
  onUpdate,
  onDelete,
  onBulkUpdate,
  ItemRow,
  ItemDetail,
}: CollapsibleItemProps<ItemInterface>) => {
  const classes = useStyles();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(!!defaultCollapsed);

  const onToggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <Grid container={true} className={classes.root}>
      <Paper variant="outlined" square={true} className={classes.paper}>
        <ItemRow
          item={item}
          index={index}
          isCollapsed={isCollapsed}
          onEditRow={onEdit}
          onDeleteRow={onDelete}
          onToggleCollapse={onToggleCollapse}
        />
      </Paper>
      {!isCollapsed && (
        <Paper variant="outlined" square={true} className={classes.paper}>
          <ItemDetail
            item={item}
            index={index}
            onEditRow={onEdit}
            onUpdateRow={onUpdate}
            onDeleteRow={onDelete}
            onToggle={onToggleCollapse}
            onBulkUpdate={onBulkUpdate}
          />
        </Paper>
      )}
    </Grid>
  );
};

export default CollapsibleItem;
