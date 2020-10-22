import { TextField } from '@material-ui/core';
import { InputProps as StandardInputProps } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { TextColorTypes, TextVariantTypes } from './types';

interface TextInputProps {
  id?: string;
  color?: TextColorTypes;
  defaultValue?: string;
  fullWidth?: boolean;
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  variant?: TextVariantTypes;
  className?: string;
  InputProps?: Partial<StandardInputProps>;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  color,
  defaultValue,
  fullWidth,
  placeholder,
  type,
  value,
  variant,
  className,
  InputProps,
  onChange,
}) => {
  return (
    <TextField
      id={id}
      color={color || 'primary'}
      className={className}
      defaultValue={defaultValue}
      fullWidth={fullWidth || false}
      placeholder={placeholder}
      label={label}
      type={type}
      value={value}
      variant={(variant || 'outlined') as any}
      InputProps={InputProps}
      onChange={onChange}
    />
  );
};

export default TextInput;
