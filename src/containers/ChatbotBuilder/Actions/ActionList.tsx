import { BaseAgentAction } from '@bavard/agent-config';
import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import CollapsibleAction from './CollapsibleAction';

interface ActionListProps {
  actions: BaseAgentAction[];
}

type CollapsedState = { [key: string]: boolean };

const ActionList = ({
  actions,
}: ActionListProps) => {
  const [isCollapsed, setIsCollapsed] = useState({} as CollapsedState);

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
          isOpen={!!isCollapsed[action.name]}
          onToggle={onToggleActionCollapse}
        />
      ))}
    </Box>
  );
};

export default ActionList;
