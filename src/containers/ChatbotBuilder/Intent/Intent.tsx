import { AgentConfig, IIntent } from '@bavard/agent-config';
import { Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import _ from 'lodash';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentAgentConfig } from '../atoms';
import AddIntent from './AddIntent';
import EditIntent from './EditIntent';
import IntentsTable from './IntentsTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      overflow: 'auto',
      backgroundColor: '#f4f4f4',
    },
    paper: {
      padding: theme.spacing(2),
    },
    header: {
      display: 'block',
      marginLeft: '80px',
      marginTop: '30px',
      marginBottom: '50px',
      fontSize: '30px',
      fontWeight: 'bold',
    },
  }),
);

const IntentSection: React.FC = () => {
  const classes = useStyles();
  const [currentIntent, setCurrentIntent] = useState<IIntent | undefined>();
  const [newIntent, setNewIntent] = useState<boolean>(false);
  const [config, setConfig] = useRecoilState<AgentConfig | undefined>(currentAgentConfig);

  if (!config) {
    return <p>Agent config is empty.</p>;
  }

  const intents = config.getIntents();
  const actions = config.getActions();
  const tagTypes = config.getTagTypes();

  const onEditIntent = (intent: IIntent) => {
    setCurrentIntent(intent);
  };

  const onSaveIntent = (intent: IIntent) => {
    if (!currentIntent) { return; }
    const newConfig = _.cloneDeep(config);
    newConfig
      .deleteIntent(currentIntent.name)
      .addIntent(intent.name, intent.defaultActionName);
    setConfig(newConfig);

    setNewIntent(false);
    setCurrentIntent(undefined);
  };

  const onDeleteIntent = (intent: IIntent) => {
    const newConfig = _.cloneDeep(config);
    newConfig.deleteIntent(intent.name);
    setConfig(newConfig);

    setCurrentIntent(undefined);
  };

  const onEditIntentClose = () => {
    setCurrentIntent(undefined);
    setNewIntent(false);
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>Manage Assistant Intents</div>
      <IntentsTable
        intents={intents ?? []}
        actions={actions}
        onAdd={() => setNewIntent(true)}
        onEditIntent={onEditIntent}
        onDeleteIntent={onDeleteIntent}
      />
      {!!intents && (
        <>
          <EditIntent
            actions={actions}
            intent={currentIntent}
            onEditIntentClose={onEditIntentClose}
            onSaveIntent={onSaveIntent}
          />
          {newIntent && (
            <AddIntent
              actions={actions}
              onAddIntentClose={onEditIntentClose}
              tags={Array.from(tagTypes.values())}
            />
          )}
        </>
      )}
    </div>
  );
};

export default IntentSection;
