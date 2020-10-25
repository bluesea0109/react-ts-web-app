import { Chip, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React from 'react';

interface IProps {
  color: 'green' | 'blue';
  text: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    blue: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
      textTransform: 'capitalize',
    },
    green: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.primary.contrastText,
      textTransform: 'capitalize',
    },
  }),
);

const StatusChip = ({ color, text }: IProps) => {
  const classes = useStyles();

  return <Chip className={classes[color]} label={text} />;
};

export default StatusChip;
