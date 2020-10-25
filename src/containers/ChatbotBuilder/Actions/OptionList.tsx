import { IIntent, IResponseOption } from '@bavard/agent-config';
import { Grid } from '@material-ui/core';
import React from 'react';
import CollapsibleOption from './CollapsibleOption';

interface OptionListProps {
  options: IResponseOption[];
  intents: IIntent[];
}

const OptionList = ({
  options,
  intents,
}: OptionListProps) => {
  return (
    <Grid container={true}>
      {options.map((option, index) => (
        <CollapsibleOption
          key={index}
          option={option}
          intents={intents}
        />
      ))}
    </Grid>
  );
};

export default OptionList;
