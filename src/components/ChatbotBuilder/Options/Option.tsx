import { IResponseOption } from '@bavard/agent-config';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentAgentConfig } from '../atoms';
import OptionsTable from './OptionsTable';

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

const Options = () => {
  const classes = useStyles();
  const [config, setConfig] = useRecoilState(currentAgentConfig);

  // eslint-disable-next-line
  const [currentOption, setCurrentOption] = useState<IResponseOption | undefined>(undefined);
  // eslint-disable-next-line
  const [newOption, setNewOption] = useState<boolean>(false);

  if (!config) {
    return <p>Agent config is empty.</p>;
  }

  const options = config.presetResponseOptions;

  const onEditOption = (option: IResponseOption) => {
    setCurrentOption(option);
  };

  const onDeleteOption = async (option: IResponseOption) => {
    config.presetResponseOptions = config.presetResponseOptions.filter(x => x === option);
    setConfig(config);
  };

  return (
    <div className={classes.root}>
      <OptionsTable
        options={options ?? []}
        onAdd={() => setNewOption(true)}
        onEditOption={onEditOption}
        onDeleteOption={onDeleteOption}
      />
    </div>
  );
};

export default Options;
