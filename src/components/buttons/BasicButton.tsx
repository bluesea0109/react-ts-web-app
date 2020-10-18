import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { TextTransformTypes } from '../types';

interface CustomStyles {
  textTransform: TextTransformTypes;
}

const useStyles = ({
  textTransform,
}: CustomStyles) => makeStyles((theme: Theme) => ({
  root: {
    textTransform,
  },
}));

interface BasicButtonProps {
  title: string;
  color?: 'inherit'|'primary'|'secondary'|'default';
  variant?: 'text'|'outlined'|'contained';
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
  })();

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
