import {
  Box,
  createStyles,
  Typography,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles, Theme } from '@material-ui/core/styles';
import FilterList from '@material-ui/icons/FilterList';
import clsx from 'clsx';
import React from 'react';
import TextInput from './TextInput';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    name: {
      marginRight: theme.spacing(1),
    },
    input: {
      '& .MuiOutlinedInput-adornedStart': {
        paddingLeft: '4px',
      },
      '& .MuiInputAdornment-positionStart': {
        marginRight: '4px',
      },
      '& .MuiOutlinedInput-input': {
        padding: theme.spacing(1),
        paddingLeft: '0px',
      },
    },
  }),
);

interface FilterBoxProps {
  name: string;
  filter: string;
  onChange: (filter: string) => void;
}

const FilterBox = ({
  name,
  filter,
  onChange,
}: FilterBoxProps) => {
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Typography className={clsx(classes.name)}>{name}</Typography>
      <TextInput
        className={clsx(classes.input)}
        value={filter}
        variant="outlined"
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FilterList />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default FilterBox;
