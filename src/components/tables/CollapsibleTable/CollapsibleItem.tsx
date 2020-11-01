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
  onEdit?: (item: ItemInterface) => void;
  onDelete?: (item: ItemInterface) => void;
  ItemRow: React.ComponentType<any>;
  ItemDetail: React.ComponentType<any>;
}

const CollapsibleItem = ({
  item,
  onEdit,
  onDelete,
  ItemRow,
  ItemDetail,
}: CollapsibleItemProps<ItemInterface>) => {
  const classes = useStyles();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const onToggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <Grid container={true} className={classes.root}>
      <Paper variant="outlined" square={true} className={classes.paper}>
        <ItemRow
          item={item}
          isCollapsed={isCollapsed}
          onEditRow={onEdit}
          onDeleteRow={onDelete}
          onToggleCollapse={onToggleCollapse}
        />
      </Paper>
      {!isCollapsed && (
        <Paper variant="outlined" square={true} className={classes.paper}>
          <ItemDetail item={item} onToggle={onToggleCollapse} />
        </Paper>
      )}
    </Grid>
  );
};

export default CollapsibleItem;
