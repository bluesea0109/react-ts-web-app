import { Button, makeStyles, SvgIconTypeMap, Theme, Typography } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import React from 'react';
import { ButtonColorTypes, ButtonVariantTypes, TextTransformTypes } from '../types';

interface CustomStyles {
  textTransform: TextTransformTypes;
  iconPosition: 'left'|'right';
}

const useStyles = ({
  textTransform,
  iconPosition,
}: CustomStyles) => makeStyles((theme: Theme) => ({
  root: {
    textTransform,

    '&.MuiButton-text': {
      padding: '8px 0px',
    },
  },
  typography: {
    marginLeft: iconPosition === 'left' ? theme.spacing(1) : 0,
    marginRight: iconPosition === 'right' ? theme.spacing(1) : 0,
  },
}));

interface IconButtonProps {
  title: string;
  color?: ButtonColorTypes;
  variant?: ButtonVariantTypes;
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  iconPosition: 'left'|'right'|undefined;
  textTransform?: TextTransformTypes;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  title,
  color,
  variant,
  Icon,
  iconPosition,
  textTransform,
  onClick,
}) => {
  const classes = useStyles({
    textTransform: textTransform || 'none',
    iconPosition: iconPosition || 'left',
  })();

  return (
    <Button
      color={color || 'primary'}
      variant={variant || 'contained'}
      className={classes.root}
      onClick={onClick}
    >
      {iconPosition !== 'right' && <Icon />}
      <Typography className={classes.typography}>{title}</Typography>
      {iconPosition === 'right' && <Icon />}
    </Button>
  );
};

export default IconButton;
