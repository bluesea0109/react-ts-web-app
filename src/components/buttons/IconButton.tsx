import { Button, makeStyles, SvgIconTypeMap, Theme } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import React from 'react';
import {
  ButtonColorTypes,
  ButtonVariantTypes,
  TextTransformTypes,
} from '../types';

interface ComponentProps {
  textTransform: TextTransformTypes;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textTransform: (props: ComponentProps) => props.textTransform,
  },
}));

interface IconButtonProps {
  title: string;
  color?: ButtonColorTypes;
  variant?: ButtonVariantTypes;
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  iconPosition: 'left' | 'right' | undefined;
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
  });

  return (
    <Button
      color={color || 'primary'}
      variant={variant || 'contained'}
      className={classes.root}
      onClick={onClick}
      startIcon={iconPosition === 'left' ? <Icon /> : undefined}
      endIcon={iconPosition === 'right' ? <Icon /> : undefined}>
      {title}
    </Button>
  );
};

export default IconButton;
