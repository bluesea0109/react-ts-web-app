import { Button, makeStyles, SvgIconTypeMap, Theme } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import clsx from 'clsx';
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
    float: iconPosition,
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
      className={clsx(classes.root)}
      onClick={onClick}
    >
      {title}
      <Icon />
    </Button>
  );
};

export default IconButton;
