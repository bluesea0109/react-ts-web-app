import { AgentConfig, BaseAgentAction, UtteranceAction } from '@bavard/agent-config';
import { Box, Grid } from '@material-ui/core';
import { Maybe } from 'graphql/jsutils/Maybe';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentAgentConfig } from '../atoms';
import ActionsTable from './ActionsTable';
import EditAction from './EditAction';

const Actions = () => {
  const [currentAction, setCurrentAction] = useState<Maybe<BaseAgentAction>>();
  const [isNewAction, setIsNewAction] = useState<boolean>(false);
  const [config, setConfig] = useRecoilState<AgentConfig | undefined>(currentAgentConfig);

  if (!config) {
    return <p>Agent config is empty.</p>;
  }

  const actions: BaseAgentAction[] = config.getActions();

  const onAddAction = () => {
    setIsNewAction(true);
    setCurrentAction(new UtteranceAction('', ''));
  };

  const onEditAction = (action: BaseAgentAction) => {
    setCurrentAction(action);
  };

  const onSaveAction = (action: BaseAgentAction) => {
    if (!currentAction) { return; }
    setConfig(
      config
        .copy()
        .deleteAction(currentAction.name)
        .addAction(action as any),
    );
    setIsNewAction(false);
    setCurrentAction(undefined);
  };

  const onDeleteAction = (action: BaseAgentAction) => {
    setConfig(
      config
        .copy()
        .deleteAction(action.name),
    );
    setCurrentAction(undefined);
  };

  const onEditActionClose = () => {
    setCurrentAction(undefined);
    setIsNewAction(false);
  };

  return (
    <Box>
      <Grid item={true} xs={12} sm={12}>
        <ActionsTable
          actions={actions ?? []}
          onAddAction={onAddAction}
          onEditAction={onEditAction}
          onDeleteAction={onDeleteAction}
        />
      </Grid>
      {!!currentAction && (
        <EditAction
          action={currentAction}
          isNewAction={isNewAction}
          onSaveAction={onSaveAction}
          onEditActionClose={onEditActionClose}
        />
      )}
    </Box>
  );
};

export default Actions;
