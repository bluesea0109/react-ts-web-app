import { Box, createStyles, InputLabel, MenuItem } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
interface ComponentProps {
  size: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectLabel: {
      color: 'black',
      fontSize: 12,
      marginBottom: 4,
    },
    selectInput: {
      margin: theme.spacing(0),
      minWidth: (props: ComponentProps)=> props.size === "large" ? "100%" : 155,
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
  size: string;
}

const DropDown: React.FC<DropDownProps> = ({
  label,
  current,
  menuItems,
  onChange,
  size
}) => {
  const props = {size: size}
  const classes = useStyles(props);

  const currentItem = current?.name || current || '';

  console.log('Menu Item ', menuItems)
  return (
    <Box>
      <InputLabel className={clsx(classes.selectLabel)}>
        {label}
      </InputLabel>

      <Select
        variant="outlined"
        value={currentItem}
        className={clsx(classes.selectInput)}
        classes={{
          icon: classes.icon,
          iconOutlined: classes.iconOutlined,
        }}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          getContentAnchorEl: null,
        }}
        onChange={(e) => onChange(e.target.value as string)}
      >
        {menuItems?.map((menu: any, index) => (
          <MenuItem key={menu.id || menu.name || index} value={menu.id || menu.name || menu}>
            {menu.name || menu}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default DropDown;
