import { BaseAgentAction } from '@bavard/agent-config';
import { Grid } from '@material-ui/core';
import React from 'react';
import CollapsibleAction from './CollapsibleAction';

interface ActionListProps {
  actions: BaseAgentAction[];
  onEditAction: (action: BaseAgentAction) => void;
  onDeleteAction: (action: BaseAgentAction) => void;
}

const ActionList = ({
  actions,
  onEditAction,
  onDeleteAction,
}: ActionListProps) => {
  return (
    <Grid container={true}>
      {actions.map(action => (
        <CollapsibleAction
          key={action.name}
          action={action}
          onEdit={onEditAction}
          onDelete={onDeleteAction}
        />
      ))}
    </Grid>
  );
};

export default ActionList;
