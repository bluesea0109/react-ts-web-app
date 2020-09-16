import { AgentConfig, BaseAgentAction, IResponseOption } from '@bavard/agent-config';
import { Grid, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import _ from 'lodash';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentAgentConfig } from '../atoms';
import ActionsTable from './ActionsTable';
import EditAction from './EditAction';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      overflow: 'auto',
    },
    paper: {
      padding: theme.spacing(2),
    },
  }),
);

const Actions = () => {
  const classes = useStyles();
  const [currentAction, setCurrentAction] = useState<BaseAgentAction | undefined>();
  const [isNewAction, setIsNewAction] = useState<boolean>(false);
  const [config, setConfig] = useRecoilState<AgentConfig | undefined>(currentAgentConfig);

  if (!config) {
    return <p>Agent config is empty.</p>;
  }

  const actions: BaseAgentAction[] = config.getActions();

  const onEditAction = (action: BaseAgentAction) => {
    setCurrentAction(action);
  };

  const onSaveAction = (action: BaseAgentAction) => {
    if (!currentAction) { return; }
    const newConfig = _.cloneDeep<AgentConfig>(config);
    newConfig
      .deleteAction(currentAction.name)
      .addAction(action);
    setConfig(newConfig);

    setIsNewAction(false);

    setCurrentAction(undefined);
  };

  const onDeleteAction = (action: BaseAgentAction) => {
    const newConfig = _.cloneDeep<AgentConfig>(config);
    newConfig.deleteAction(action.name);
    setConfig(newConfig);

    setCurrentAction(undefined);
  };

  const onEditActionClose = () => {
    setCurrentAction(undefined);
    setIsNewAction(false);
  };

  return (
    <div className={classes.root}>
      <Grid item={true} xs={12} sm={12}>
        <Paper className={classes.paper}>
          <ActionsTable
            actions={actions ?? []}
            onEditAction={onEditAction}
            onDeleteAction={onDeleteAction}
            onAdd={() => setIsNewAction(true)}
          />
        </Paper>
      </Grid>
      {!!actions && (
        <EditAction
          action={currentAction}
          isNewAction={isNewAction}
          onSaveAction={onSaveAction}
          onEditActionClose={onEditActionClose}
        />
      )}
    </div>
  );
};

export default Actions;
