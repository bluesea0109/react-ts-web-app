import { AgentConfig, BaseAgentAction, UtteranceAction } from '@bavard/agent-config';
import { Grid, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Maybe } from 'graphql/jsutils/Maybe';
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
  const [currentAction, setCurrentAction] = useState<Maybe<BaseAgentAction>>();
  const [isNewAction, setIsNewAction] = useState<boolean>(false);
  const [config, setConfig] = useRecoilState<AgentConfig | undefined>(currentAgentConfig);

  if (!config) {
    return <p>Agent config is empty.</p>;
  }

  const actions: BaseAgentAction[] = config.getActions();

  const onAdd = () => {
    setIsNewAction(true);
    setCurrentAction(new UtteranceAction('', ''));
  };

  const onEditAction = (action: BaseAgentAction) => {
    setCurrentAction(action);
  };

  const onSaveAction = (action: BaseAgentAction) => {
    if (!currentAction) { return; }
    const newConfig = _.cloneDeep<AgentConfig>(config);
    newConfig
      .deleteAction(currentAction.name)
      .addAction(action as any);
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
            onAdd={onAdd}
            onEditAction={onEditAction}
            onDeleteAction={onDeleteAction}
          />
        </Paper>
      </Grid>
      {!!currentAction && (
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
