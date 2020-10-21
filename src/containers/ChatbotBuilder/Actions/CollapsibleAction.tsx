import { BaseAgentAction } from '@bavard/agent-config';
import { Box } from '@material-ui/core';
import React from 'react';

interface CollapsibleActionProps {
  action: BaseAgentAction;
  isOpen: boolean;
  onToggle: (action: BaseAgentAction) => void;
}

const CollapsibleAction = ({
  action,
  isOpen,
  onToggle,
}: CollapsibleActionProps) => {
  return (
    <Box/>
  );
};

export default CollapsibleAction;
