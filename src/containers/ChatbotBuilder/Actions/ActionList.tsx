import { BaseAgentAction } from '@bavard/agent-config';
import { Box } from '@material-ui/core';
import React, { useState } from 'react';
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
    <Box>
      {actions.map(action => (
        <CollapsibleAction
          key={action.name}
          action={action}
          onEdit={onEditAction}
          onDelete={onDeleteAction}
        />
      ))}
    </Box>
  );
};

export default ActionList;
