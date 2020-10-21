import { BaseAgentAction } from '@bavard/agent-config';
import {
  Box,
  Button,
  Paper,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Edit } from '@material-ui/icons';
import 'firebase/auth';
import _ from 'lodash';
import MaterialTable, { Column } from 'material-table';
import React, { useMemo, useState } from 'react';
import { FilterBox } from '../../../components';
import ActionDetailPanel from './ActionDetailPanel';
import ActionList from './ActionList';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
  }),
);

interface ActionState {
  columns: Column<BaseAgentAction>[];
  data: BaseAgentAction[] | undefined;
}

interface ActionsTableProps {
  actions: BaseAgentAction[];
  onAddAction: () => void;
  onEditAction: (action: BaseAgentAction) => void;
  onDeleteAction: (action: BaseAgentAction) => void;
}

const ActionsTable = ({
  actions,
  onAddAction,
  onEditAction,
  onDeleteAction,
}: ActionsTableProps) => {
  const classes = useStyles();
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredActions = useMemo(() => {
    return actions.filter(action => {
      if (nameFilter && action.name.includes(nameFilter)) {
        return false;
      } else if (typeFilter && action.type.includes(typeFilter)) {
        return false;
      }
      return true;
    });
  }, [actions, nameFilter, typeFilter]);

  return filteredActions.length ? (
    <Paper aria-label="Agents" className={classes.root}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        paddingBottom={2}
      >
        <Box>
          <Typography variant="h6">
            Actions
          </Typography>
          <Typography>
            Select an Action below to change the Assistant's behavior:
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={onAddAction}>
          Add New Action
        </Button>
      </Box>

      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box flex={1}>
          <FilterBox name="Action Name" filter={nameFilter} onChange={setNameFilter} />
        </Box>
        <Box flex={1}>
          <FilterBox name="Action Type" filter={typeFilter} onChange={setTypeFilter} />
        </Box>
      </Box>

      <ActionList actions={filteredActions}/>
    </Paper>
  ) : (
    <Typography align="center" variant="h6">
      {'No Actions found'}
    </Typography>
  );
};

export default ActionsTable;
