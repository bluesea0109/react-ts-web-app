import { IIntent, IResponseOption } from '@bavard/agent-config';
import { Grid } from '@material-ui/core';
import React from 'react';
import CollapsibleOption from './CollapsibleOption';

interface OptionListProps {
  intents: IIntent[];
  options: IResponseOption[];
  onSetOptions: (options: IResponseOption[]) => void;
}

const OptionList = ({
  intents,
  options,
  onSetOptions,
}: OptionListProps) => {
  const setOption = (index: number, option: IResponseOption) => {
    onSetOptions([ ...options.slice(0, index), option, ...options.slice(index + 1)]);
  };

  return (
    <Grid container={true}>
      {options.map((option, index) => (
        <CollapsibleOption
          key={index}
          index={index + 1}
          intents={intents}
          option={option}
          onEditOption={(option) => setOption(index, option)}
        />
      ))}
    </Grid>
  );
};

export default OptionList;
