import { Box, createStyles, InputLabel, MenuItem } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectLabel: {
      color: 'black',
      fontSize: 12,
      marginBottom: 4,
    },
    selectInput: {
      margin: theme.spacing(0),
      minWidth: 155,
      color: 'black',
      borderRadius: 2,
      borderColor: 'white',

      '& .MuiSelect-outlined': {
        padding: '7px 8px',
      },
      '& fieldset': {
        top: 0,

        '& legend': {
          display: 'none',
        },
      },
    },
    icon: {
      fill: 'blue',
      fontSize: 36,
      top: 'calc(50% - 18px)',
    },
    iconOutlined: {
      right: 0,
    },
  }),
);

interface DropDownProps {
  label: string;
  current: any;
  menuItems: any[];
  onChange: (item: string) => void;
}

const DropDown: React.FC<DropDownProps> = ({
  label,
  current,
  menuItems,
  onChange,
}) => {
  const classes = useStyles();

  const currentItem = current?.name || current || '';

  return (
    <Box>
      <InputLabel className={clsx(classes.selectLabel)}>
        {label}
      </InputLabel>

      <Select
        variant="outlined"
        value={currentItem}
        className={clsx(classes.selectInput)}
        onChange={(e) => onChange(e.target.value as string)}
        classes={{
          icon: classes.icon,
          iconOutlined: classes.iconOutlined,
        }}
      >
        {menuItems?.map((menu: any) => (
          <MenuItem key={menu.id} value={menu.id}>
            {menu.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default DropDown;
