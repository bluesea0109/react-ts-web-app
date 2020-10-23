import { AgentConfig, IResponseOption } from '@bavard/agent-config';
import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { IconButton } from '../../../components';
import { currentAgentConfig } from '../atoms';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'auto',
    },
  }),
);

interface OptionListProps {
  options: IResponseOption[];
}

const OptionList = ({
  options,
}: OptionListProps) => {
  const classes = useStyles();

  const [config] = useRecoilState<AgentConfig | undefined>(currentAgentConfig);
  const [currentOption, setCurrentOption] = useState<IResponseOption | undefined>();
  const [isNewOption, setIsNewOption] = useState<boolean>(true);

  if (!config) { return null; }

  const intents = config.getIntents();

  return (
    <Grid container={true} className={classes.root}>
      <Grid container={true} item={true} justify="flex-end">
        <IconButton
          title={options.length ? 'Add Another Option' : 'Add an Option'}
          variant="text"
          Icon={AddCircleOutlineIcon}
          iconPosition="right"
          onClick={() => {}}/>
      </Grid>
    </Grid>
  );
};

export default OptionList;
