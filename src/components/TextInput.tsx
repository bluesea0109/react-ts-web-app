import { TextField } from '@material-ui/core';
import { InputProps as StandardInputProps } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { TextColorTypes, TextVariantTypes } from './types';

interface TextInputProps {
  id?: string;
  color?: TextColorTypes;
  className?: string;
  label?: string;
  defaultValue?: string;
  fullWidth?: boolean;
  placeholder?: string;
  padding?: string;
  value?: string;
  variant?: TextVariantTypes;
  InputProps?: Partial<StandardInputProps>;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  color,
  className,
  defaultValue,
  fullWidth,
  placeholder,
  value,
  variant,
  InputProps,
  onChange,
}) => {
  return (
    <TextField
      id={id}
      label={label}
      color={color || 'primary'}
      defaultValue={defaultValue}
      fullWidth={fullWidth || false}
      placeholder={placeholder}
      value={value}
      variant={(variant || 'outlined') as any}
      className={className}
      InputProps={InputProps}
      onChange={onChange}
    />
  );
};

export default TextInput;
