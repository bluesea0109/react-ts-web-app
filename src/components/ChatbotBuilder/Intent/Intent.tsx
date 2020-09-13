import { IIntent } from '@bavard/agent-config';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
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
    },
    paper: {
      padding: theme.spacing(2),
    },
  }),
);

const IntentSection: React.FC = () => {
  const classes = useStyles();
  const [currentIntent, setCurrentIntent] = useState<IIntent | undefined>();
  const [newIntent, setNewIntent] = useState<boolean>(false);
  const [config, setConfig] = useRecoilState(currentAgentConfig);

  if (!config) {
    return <p>Agent config is empty.</p>;
  }

  const intents = config.getIntents();
  const actions = config.getActions();
  const tagTypes = config.getTagTypes();

  const onEditIntent = (intent: IIntent) => {
    setCurrentIntent(intent);
  };

  const onSaveIntent = async (intent: IIntent) => {
    config.deleteIntent(intent.name);
    config.addIntent(intent.name, intent.defaultActionName);
    setConfig(config);
    setNewIntent(false);
    setCurrentIntent(undefined);
  };

  const onDeleteIntent = async (intent: IIntent) => {
    config.deleteIntent(intent.name);
    setConfig(config);
    setCurrentIntent(undefined);
  };

  const onEditIntentClose = () => {
    setCurrentIntent(undefined);
    setNewIntent(false);
  };

  return (
    <div className={classes.root}>
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
