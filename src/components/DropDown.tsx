import { Box, createStyles, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
interface ComponentProps {
  padding?: string;
  size?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topLabel: {
      color: 'black',
      fontSize: 12,
      marginBottom: 4,
    },
    selectInput: {
      margin: theme.spacing(0),
      minWidth: (props: ComponentProps) => props.size === 'large' ? '100%' : 155,
      color: 'black',
      width: '100%',
      borderRadius: 2,
      borderColor: 'white',

      '& .MuiSelect-outlined': {
        padding: (props: ComponentProps) => props.padding || '8px',
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
  size?: string;
}

const DropDown: React.FC<DropDownProps> = ({
  label,
  labelPosition,
  current,
  padding,
  fullWidth,
  menuItems,
  onChange,
  size,
}) => {
  const classes = useStyles({ padding, size });

  const currentItem = current?.uname || current?.name || current || '';

  const MainContent = () => (
    <Grid container={true}>
      {labelPosition === 'top' && label && label.length && (
        <InputLabel className={classes.topLabel}>
          {label}
        </InputLabel>
      )}
      {labelPosition === 'left' && label && label.length && (
        <Typography variant="subtitle1" style={{fontWeight: 'bold'}}>
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
        style={{backgroundColor: 'white'}}
        onChange={(e) => onChange(e.target.value as string)}
      >
        {menuItems?.map((menu: any, index) => (
          <MenuItem key={ menu.uname || menu.id || menu.name || index} value={menu.uname || menu.id || menu.name || menu}>
            {menu.uname || menu.name || menu}
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
