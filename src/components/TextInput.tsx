import {
  Grid,
  createStyles, makeStyles, Theme,
  InputProps as StandardInputProps,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { TextColorTypes, TextVariantTypes } from './types';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    name: {
      marginRight: theme.spacing(1),
    },
  }))

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
  const classes = useStyles();

  return (
    <Grid container={true}>
      {label && label.length && (
        <Typography variant="h6" style={{fontWeight: 'bold'}} className={classes.name}>
          {label}
        </Typography>
      )}
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
    </Grid>
  );
};

export default TextInput;
