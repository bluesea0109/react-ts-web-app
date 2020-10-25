import { Box, createStyles, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

interface Styles {
  padding?: string;
}

const useStyles = ({
  padding,
}: Styles) => makeStyles((theme: Theme) =>
  createStyles({
    topLabel: {
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
        padding: padding || '8px',
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
  labelPosition?: 'left'|'top';
  current: any;
  padding?: string;
  menuItems: any[];
  fullWidth?: boolean;
  onChange: (item: string) => void;
}

const DropDown: React.FC<DropDownProps> = ({
  label,
  labelPosition,
  current,
  padding,
  fullWidth,
  menuItems,
  onChange,
}) => {
  const classes = useStyles({ padding })();

  const currentItem = current?.name || current || '';

  const MainContent = () => (
    <Grid container={true}>
      {labelPosition === 'top' && label && label.length && (
        <InputLabel className={classes.topLabel}>
          {label}
        </InputLabel>
      )}
      {labelPosition === 'left' && label && label.length && (
        <Typography variant="h6" style={{fontWeight: 'bold'}}>
          {label}
        </Typography>
      )}

      <Select
        variant="outlined"
        value={currentItem}
        className={classes.selectInput}
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
    </Grid>
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
