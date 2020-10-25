import {
  AgentConfig,
  EResponseOptionTypes,
  IResponseOption,
} from '@bavard/agent-config';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentAgentConfig } from '../atoms';
import EditOption from './EditOption2';
import SortableOptions from './SortableOptions';

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
  onSetOptions: (options: IResponseOption[]) => void;
};

const Options = ({
  options,
  onAddOption,
  onDeleteOption,
  onUpdateOption,
  onSetOptions,
}: OptionsProps) => {
  const classes = useStyles();

  const [config] = useRecoilState<AgentConfig | undefined>(currentAgentConfig);
  const [currentOption, setCurrentOption] = useState<IResponseOption | undefined>(undefined);
  const [isNewOption, setIsNewOption] = useState<boolean>(true);

  if (!config) {
    return <p>Agent config is empty.</p>;
  }

  const intents = config.getIntents();

  const handleAdd = () => {
    setCurrentOption({
      type: EResponseOptionTypes.TEXT,
      text: '',
    } as IResponseOption);
  };

  const handleAddOption = (option: IResponseOption) => {
    if (!currentOption) { return; }
    onAddOption(option);
    setIsNewOption(true);
    setCurrentOption(undefined);
  };

  const handleEditOption = (option: IResponseOption) => {
    setIsNewOption(false);
    setCurrentOption(option);
  };

  const handleSaveOption = (option: IResponseOption) => {
    if (!currentOption) { return; }
    onUpdateOption(currentOption.text, option);
    setIsNewOption(true);
    setCurrentOption(undefined);
  };

  const handleEditOptionClose = () => {
    setCurrentOption(undefined);
    setIsNewOption(true);
  };

  return (
    <div className={classes.root}>
      <SortableOptions
        options={options ?? []}
        setOptions={onSetOptions}
        onAdd={handleAdd}
        onEditOption={handleEditOption}
        onDeleteOption={onDeleteOption}
      />
      {
        !!options &&
        <EditOption
          option={currentOption}
          isNewOption={isNewOption}
          intents={intents}
          onAddOption={handleAddOption}
          onSaveOption={handleSaveOption}
          onEditOptionClose={handleEditOptionClose}
        />
      }
    </div>
  );
};

export default Options;
