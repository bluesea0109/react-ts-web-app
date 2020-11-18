import { IIntent } from '@bavard/agent-config';
import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import {
  Delete,
  Edit,
  KeyboardArrowDown,
  KeyboardArrowRight,
} from '@material-ui/icons';
import React from 'react';
import { CollapsibleTable } from '../../../components';
import { Examples } from '../Examples';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '100%',
    },
    header: {
      padding: '4px 8px 4px 4px',
    },
  }),
);

interface ItemRowProps {
  item: IIntent;
  isCollapsed: boolean;
  onEditRow: (item: IIntent) => void;
  onDeleteRow: (item: IIntent) => void;
  onToggleCollapse: () => void;
}

interface ItemDetailProps {
  item: IIntent;
}

interface NewActionTableProps {
  intents: IIntent[];
  onAddAction?: () => void;
  onEditIntent: (action: IIntent) => void;
  onDeleteIntent: (action: IIntent) => void;
}

const IntentRow = ({
  item,
  isCollapsed,
  onEditRow,
  onDeleteRow,
  onToggleCollapse,
}: ItemRowProps) => {
  const classes = useStyles();

  return (
    <Grid container={true} className={classes.header} alignItems="center">
      <Grid item={true} container={true} xs={6} sm={6} alignItems="center">
        <Box mr={1}>
          {isCollapsed ? (
            <KeyboardArrowRight
              color="primary"
              fontSize="large"
              onClick={onToggleCollapse}
            />
          ) : (
            <KeyboardArrowDown
              color="primary"
              fontSize="large"
              onClick={onToggleCollapse}
            />
          )}
        </Box>
        <Typography style={{ textTransform: 'capitalize' }}>
          {item.name}
        </Typography>
      </Grid>
      <Grid item={true} xs={4} sm={4}>
        <Typography>{item.defaultActionName}</Typography>
      </Grid>
      <Grid item={true} container={true} xs={2} sm={2} justify="flex-end">
        <Box mr={1}>
          <Edit onClick={() => onEditRow(item)} />
        </Box>
        <Box ml={1}>
          <Delete onClick={() => onDeleteRow(item)} />
        </Box>
      </Grid>
    </Grid>
  );
};

const IntentDetail = ({ item }: ItemDetailProps) => <Examples intent={item} />;

const NewActionTable = ({
  intents,
  onEditIntent,
  onDeleteIntent,
}: NewActionTableProps) => {
  return (
    <CollapsibleTable
      items={intents}
      defaultCollapsed={true}
      onEditItem={onEditIntent}
      onDeleteItem={onDeleteIntent}
      ItemRow={IntentRow}
      ItemDetail={IntentDetail}
    />
  );
};

export default NewActionTable;
