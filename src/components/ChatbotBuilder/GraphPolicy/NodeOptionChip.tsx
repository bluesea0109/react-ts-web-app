import { ResponseOption, HyperlinkOption } from '@bavard/graph-policy';
import { Avatar, Paper, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from '@material-ui/icons';
import React, { ReactElement } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    option: {
      height: 30,
      display: 'flex',
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      fontSize: 11,
      padding: 2,
      margin: 2,
      borderRadius: theme.spacing(1),
      alignItems: 'center',
    },
    optionText: {
      padding: theme.spacing(1),
    },
    optionImg: {
      height: 30,
      width: 30,
    },
    actions: {
      position: 'absolute',
      right: theme.spacing(1),
      zIndex: 1,
    },
  })
);

interface IChipProps {
  option: ResponseOption;
  actions?: ReactElement;
}

export default function NodeOptionChip({ option, actions }: IChipProps) {
  const classes = useStyles();

  if (option instanceof HyperlinkOption) {
    return (
      <Tooltip
        disableFocusListener={true}
        title={`Hyperlink option ${option.targetLink}`}>
        <Paper className={classes.option}>
          <Avatar className={classes.optionImg}>
            <Link />
          </Avatar>
          <div className={classes.optionText}>
            <a
              href={option.targetLink}
              target="_blank"
              rel="noopener noreferrer">
              {option.text}
            </a>
          </div>

          <div className={classes.actions}>{actions}</div>
        </Paper>
      </Tooltip>
    );
  }
  return <></>;
}
