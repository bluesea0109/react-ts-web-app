import { IResponseOption } from '@bavard/agent-config';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
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

const Options = () => {
  const classes = useStyles();

  const [options, setOptions] = useState<IResponseOption[]>([]);
  const [currentOption, setCurrentOption] = useState<IResponseOption | undefined>(undefined);
  const [isNewOption, setIsNewOption] = useState<boolean>(false);

  const onAdd = () => {
    setCurrentOption({
      type: 'TEXT',
      text: '',
      intent: '',
    });
  };

  const onEditOption = (option: IResponseOption) => {
    setCurrentOption(option);
  };

  const onDeleteOption = (option: IResponseOption) => {
    setOptions([...options.filter(each => each.text !== option.text)]);
  };

  const onSaveOption = (option: IResponseOption) => {
    if (!currentOption) { return; }
    const newOptions = [
      ...options.filter(each => each.text !== currentOption.text),
      option,
    ];
    setOptions(newOptions);

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
      {!!options && (
        <>
          <EditOption
            option={currentOption}
            isNewOption={isNewOption}
            onSaveOption={onSaveOption}
            onEditOptionClose={onEditOptionClose}
          />
        </>
      )}
    </div>
  );
};

export default Options;
