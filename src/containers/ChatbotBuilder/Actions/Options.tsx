import { AgentConfig, IResponseOption } from '@bavard/agent-config';
import { createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { IconButton } from '../../../components';
import { currentAgentConfig } from '../atoms';
import OptionList from './OptionList';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      overflow: 'auto',
    },
  }),
);

interface OptionsProps {
  options: IResponseOption[];
}

const Options = ({
  options,
}: OptionsProps) => {
  const classes = useStyles();
  const [config] = useRecoilState<AgentConfig | undefined>(currentAgentConfig);

  if (!config) { return null; }

  const intents = config.getIntents();

  return (
    <Grid container={true} className={classes.root}>
      <Grid container={true} item={true}>
        <Typography variant="h6">
          Add a New User Response Option
        </Typography>
      </Grid>
      <Grid container={true} item={true}>
        <Typography variant="subtitle1">
          Add Options to create choices your user can select:
        </Typography>
      </Grid>
      <OptionList
        options={options}
        intents={intents}
      />
      <Grid container={true} item={true} justify="flex-end">
        <IconButton
          title={options.length ? 'Add Another Option' : 'Add an Option'}
          variant="text"
          Icon={AddCircleOutlineIcon}
          iconPosition="right"
          onClick={() => {}}
        />
      </Grid>
    </Grid>
  );
};

export default Options;
