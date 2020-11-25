import React, { useEffect, useState } from 'react';
import { Grid, makeStyles, Box } from '@material-ui/core';
import { Field, FIELD_TYPE } from './type';
import { DropDown, TextInput } from '@bavard/react-components';

interface GroupFieldProps {
  field: Field;
  options: string[];
  fieldType: FIELD_TYPE;
  onUpdate: (field: Field) => void;
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
export const GroupField: React.FC<GroupFieldProps> = ({
  field,
  options,
  fieldType,
  onUpdate: handleUpdate,
}) => {
  const classes = useStyles();

  const [dropDownValue, setDropDownValue] = useState(field.name);
  const [textValue, setTextValue] = useState(field.value);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTextValue(e.target.value);
  };

  const handleDropDownValueChange = (value: string) => {
    setDropDownValue(value);
  };

  useEffect(() => {
    handleUpdate({
      name: dropDownValue,
      value: textValue,
    } as Field);
  }, [dropDownValue, textValue]);

  return (
    <Box display="flex" flexDirection="row" width={1} my={1}>
      <Grid item sm={4} xs={4} className={classes.nameField}>
        <DropDown
          fullWidth={true}
          labelPosition="top"
          label={fieldType}
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
          label={
            fieldType === FIELD_TYPE.INTENT ? 'Utterance (optional)' : 'Value'
          }
          className={classes.input}
          onChange={handleTextChange}
        />
      </Grid>
    </Box>
  );
};
