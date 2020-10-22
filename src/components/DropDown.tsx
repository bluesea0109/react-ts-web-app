import { Box, createStyles, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
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
      color: 'black',
      width: '100%',
      borderRadius: 2,
      borderColor: 'white',
      minWidth: 155,

      '& .MuiSelect-outlined': {
        padding: '8px 8px',
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
  label?: string;
  current: any;
  menuItems: any[];
  fullWidth?: boolean;
  onChange: (item: string) => void;
}

const DropDown: React.FC<DropDownProps> = ({
  label,
  current,
  fullWidth,
  menuItems,
  onChange,
}) => {
  const classes = useStyles();

  const currentItem = current?.name || current || '';

  const MainContent = () => (
    <>
      {label && label.length && (
        <InputLabel className={clsx(classes.selectLabel)}>
          {label}
        </InputLabel>
      )}

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
        {menuItems?.map((menu: any) => (
          <MenuItem key={menu.id} value={menu.id}>
            {menu.name}
          </MenuItem>
        ))}
      </Select>
    </>
  );

  return fullWidth ? (
    <Grid container={true} item={true} xs={12} sm={12}>
      <MainContent />
    </Grid>
  ) : (
    <Box>
      <MainContent/>
    </Box>
  );
};

export default DropDown;
