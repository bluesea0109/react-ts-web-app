import { IIntent, IResponseOption } from '@bavard/agent-config';
import { Box } from '@material-ui/core';
import React, { useState } from 'react';
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
    <Box>
      {options.map((option, index) => (
        <CollapsibleOption
          key={index}
          option={option}
          intents={intents}
        />
      ))}
    </Box>
  );
};

export default OptionList;
