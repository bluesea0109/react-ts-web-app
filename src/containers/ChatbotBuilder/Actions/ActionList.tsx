import { BaseAgentAction } from '@bavard/agent-config';
import { EAgentActionTypes } from '@bavard/agent-config/dist/enums';
import { CollapsibleTable } from '@bavard/react-components';
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
import ActionDetailPanel from './ActionDetailPanel';

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

interface ItemHeaderProps {
  item: BaseAgentAction;
  isCollapsed: boolean;
  onEditRow: (item: BaseAgentAction) => void;
  onDeleteRow: (item: BaseAgentAction) => void;
  onToggleCollapse: () => void;
}

interface ItemDetailProps {
  item: BaseAgentAction;
}

interface NewActionTableProps {
  actions: BaseAgentAction[];
  onAddAction?: () => void;
  onEditAction: (action: BaseAgentAction) => void;
  onDeleteAction: (action: BaseAgentAction) => void;
}

const ActionHeader: React.FC<ItemHeaderProps> = ({
  item,
  isCollapsed,
  onEditRow,
  onDeleteRow,
  onToggleCollapse,
}) => {
  const classes = useStyles();

  const getActionType = (action: BaseAgentAction) => {
    switch (action.type) {
      case EAgentActionTypes.UTTERANCE_ACTION:
        return 'Utterance';
      case EAgentActionTypes.EMAIL_ACTION:
        return 'Email';
      case EAgentActionTypes.FORM_ACTION:
        return 'Form';
      default:
        return 'Utterance';
    }
  };

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
        <Typography>{getActionType(item)}</Typography>
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

const ActionDetail = ({ item }: ItemDetailProps) => (
  <ActionDetailPanel action={item} />
);

const NewActionTable = ({
  actions,
  onEditAction,
  onDeleteAction,
}: NewActionTableProps) => {
  return (
    <CollapsibleTable
      items={actions}
      defaultCollapsed={true}
      onEditItem={onEditAction}
      onDeleteItem={onDeleteAction}
      ItemHeader={ActionHeader}
      ItemDetail={ActionDetail}
    />
  );
};

export default NewActionTable;
