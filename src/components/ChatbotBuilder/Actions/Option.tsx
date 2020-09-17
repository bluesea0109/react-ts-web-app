import {
  AgentConfig,
  EResponseOptionTypes,
  IResponseOption,
} from '@bavard/agent-config';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentAgentConfig } from '../atoms';
import EditOption from './EditOption';
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

type OptionsProps = {
  options: IResponseOption[];
  onAddOption: (option: IResponseOption) => void;
  onDeleteOption: (option: IResponseOption) => void;
  onUpdateOption: (text: string, option: IResponseOption) => void;
};

const Options = ({
  options,
  onAddOption,
  onDeleteOption,
  onUpdateOption,
}: OptionsProps) => {
  const classes = useStyles();

  const [config] = useRecoilState<AgentConfig | undefined>(currentAgentConfig);
  const [currentOption, setCurrentOption] = useState<IResponseOption | undefined>(undefined);
  const [isNewOption, setIsNewOption] = useState<boolean>(false);

  if (!config) {
    return <p>Agent config is empty.</p>;
  }

  const intents = config.getIntents();

  const onAdd = () => {
    setCurrentOption({
      type: EResponseOptionTypes.TEXT,
      text: '',
      intent: '',
    } as IResponseOption);
  };

  const onEditOption = (option: IResponseOption) => {
    setCurrentOption(option);
  };

  const onSaveOption = (option: IResponseOption) => {
    if (!currentOption) { return; }
    onUpdateOption(currentOption.text, option);
    setIsNewOption(false);
    setCurrentOption(undefined);
  };

  const onEditOptionClose = () => {
    setCurrentOption(undefined);
    setIsNewOption(false);
  };

  return (
    <div className={classes.root}>
      <OptionsTable
        options={options ?? []}
        onAdd={onAdd}
        onEditOption={onEditOption}
        onDeleteOption={onDeleteOption}
      />
      {
        !!options &&
        <EditOption
          option={currentOption}
          isNewOption={isNewOption}
          intents={intents}
          onAddOption={onAddOption}
          onSaveOption={onSaveOption}
          onEditOptionClose={onEditOptionClose}
        />
      }
    </div>
  );
};

export default Options;
