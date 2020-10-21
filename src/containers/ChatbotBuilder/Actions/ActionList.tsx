import { BaseAgentAction } from '@bavard/agent-config';
import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import CollapsibleAction from './CollapsibleAction';

interface ActionListProps {
  actions: BaseAgentAction[];
  onEditAction: (action: BaseAgentAction) => void;
  onDeleteAction: (action: BaseAgentAction) => void;
}

type CollapsedState = { [key: string]: boolean };

const ActionList = ({
  actions,
  onEditAction,
  onDeleteAction,
}: ActionListProps) => {
  const [isCollapsed, setIsCollapsed] = useState<CollapsedState>({});

  const onToggleActionCollapse = (action: BaseAgentAction) => {
    setIsCollapsed({
      ...isCollapsed,
      [action.name]: !isCollapsed[action.name],
    });
  };

  return (
    <Box>
      {actions.map(action => (
        <CollapsibleAction
          key={action.name}
          action={action}
          isOpen={isCollapsed[action.name]}
          onToggle={onToggleActionCollapse}
          onEdit={onEditAction}
          onDelete={onDeleteAction}
        />
      ))}
    </Box>
  );
};

export default ActionList;
