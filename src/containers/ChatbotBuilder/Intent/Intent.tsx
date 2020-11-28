import { AgentConfig, IIntent } from '@bavard/agent-config';
import { Box, createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
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
      backgroundColor: '#f4f4f4',
    },
  }),
);

const Intents: React.FC = () => {
  const classes = useStyles();
  const [currentIntent, setCurrentIntent] = useState<IIntent | undefined>();
  const [isNewIntent, setIsNewIntent] = useState<boolean>(false);
  const [config, setConfig] = useRecoilState<AgentConfig | undefined>(
    currentAgentConfig,
  );

  if (!config) {
    return null;
  }

  const intents = config.getIntents();
  const actions = config.getActions();
  const tagTypes = config.getTagTypes();

  const onAddIntent = () => {
    setIsNewIntent(true);
    setCurrentIntent({ name: '' } as IIntent);
  };

  const onEditIntent = (intent: IIntent) => {
    setCurrentIntent(intent);
  };

  const onSaveIntent = (intent: IIntent) => {
    if (!currentIntent) {
      return;
    }

    setConfig(
      config
        .copy()
        .deleteIntent(currentIntent.name)
        .addIntent(intent.name, intent.defaultActionName),
    );
    setIsNewIntent(false);
    setCurrentIntent(undefined);
  };

  const onDeleteIntent = (intent: IIntent) => {
    setConfig(config.copy().deleteIntent(intent.name));
    setCurrentIntent(undefined);
  };

  const onEditIntentClose = () => {
    setCurrentIntent(undefined);
    setIsNewIntent(false);
  };

  return (
    <Box className={classes.root}>
      <Grid item={true} xs={12} sm={12}>
        <IntentsTable
          intents={intents ?? []}
          actions={actions}
          onAddIntent={onAddIntent}
          onEditIntent={onEditIntent}
          onDeleteIntent={onDeleteIntent}
        />
      </Grid>
      {!!intents && (
        <>
          <EditIntent
            actions={actions}
            intent={currentIntent}
            onEditIntentClose={onEditIntentClose}
            onSaveIntent={onSaveIntent}
          />
          {isNewIntent && (
            <AddIntent
              actions={actions}
              onAddIntentClose={onEditIntentClose}
              tags={Array.from(tagTypes.values())}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default Intents;
