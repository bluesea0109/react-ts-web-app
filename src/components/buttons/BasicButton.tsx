import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { ButtonColorTypes, ButtonVariantTypes, TextTransformTypes } from '../types';

interface ComponentProps {
  textTransform: TextTransformTypes;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textTransform: (props: ComponentProps) => props.textTransform,
  },
}));

interface BasicButtonProps {
  title: string;
  color?: ButtonColorTypes;
  variant?: ButtonVariantTypes;
  textTransform?: TextTransformTypes;
  onClick: () => void;
}

const BasicButton: React.FC<BasicButtonProps> = ({
  title,
  color,
  variant,
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
      className={clsx(classes.root)}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default BasicButton;
