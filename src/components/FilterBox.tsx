import { createStyles } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles, Theme } from '@material-ui/core/styles';
import FilterList from '@material-ui/icons/FilterList';
import React from 'react';
import TextInput from './TextInput';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    <TextInput
      className={classes.input}
      label={name}
      value={filter}
      variant="outlined"
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FilterList />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default FilterBox;
