import React, { useState } from 'react';
import { Grid, makeStyles, Box } from '@material-ui/core';
import { FIELD_TYPE } from './type';
import { DropDown, TextInput } from '@bavard/react-components';

interface GroupFieldProps {
  field: FIELD_TYPE;
  options: string[];
}

const useStyles = makeStyles((theme) => ({
  input: {
    '& .MuiOutlinedInput-input': {
      padding: '8px 8px',
    },
  },
  nameField: {
    paddingRight: theme.spacing(2),
  },
  valueField: {
    paddingLeft: theme.spacing(2),
  },
}));
export const GroupField = ({ options, field }: GroupFieldProps) => {
  const classes = useStyles();

  const [dropDownValue, setDropDownValue] = useState('');
  const [textValue, setTextValue] = useState('');

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTextValue(e.target.value);
  };

  const handleDropDownValueChange = (value: string) => {
    setDropDownValue(value);
  };

  return (
    <Box display="flex" flexDirection="row" width={1} my={1}>
      <Grid item sm={4} xs={4} className={classes.nameField}>
        <DropDown
          fullWidth={true}
          labelPosition="top"
          label={field}
          variant="Typography"
          menuItems={options}
          current={dropDownValue}
          onChange={handleDropDownValueChange}
        />
      </Grid>
      <Grid item sm={8} xs={8} className={classes.valueField}>
        <TextInput
          fullWidth={true}
          value={textValue}
          label={field === FIELD_TYPE.INTENT ? 'Utterance (optional)' : 'Value'}
          className={classes.input}
          onChange={handleTextChange}
        />
      </Grid>
    </Box>
  );
};
