import { createStyles, TextField } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { ChangeEvent } from 'react';
import { TextColorTypes, TextVariantTypes } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      margin: theme.spacing(1),
    },
  }),
);

interface TextInputProps {
  id?: string;
  color?: TextColorTypes;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  value?: string;
  variant?: TextVariantTypes;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  color,
  defaultValue,
  placeholder,
  value,
  variant,
  onChange,
}) => {
  const classes = useStyles();

  return (
    <TextField
      id={id}
      label={label}
      color={color || 'primary'}
      defaultValue={defaultValue}
      placeholder={placeholder}
      value={value}
      variant={(variant || 'outlined') as any}
      className={clsx(classes.input)}
      onChange={onChange}
    />
  );
};

export default TextInput;
