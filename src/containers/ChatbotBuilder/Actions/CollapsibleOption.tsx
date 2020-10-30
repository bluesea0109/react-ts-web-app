import { IIntent, IResponseOption } from '@bavard/agent-config';
import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import React, { useState } from 'react';
import EditOption from './EditOption';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      marginBttom: theme.spacing(2),
    },
    paper: {
      width: '100%',
    },
    header: {
      padding: '4px 8px 4px 4px',
    },
  }),
);

interface CollapsibleOptionProps {
  index: number;
  intents: IIntent[];
  option: IResponseOption;
  onEditOption: (option: IResponseOption) => void;
  onDeleteOption: () => void;
}

const CollapsibleOption = ({
  index,
  intents,
  option,
  onEditOption,
  onDeleteOption,
}: CollapsibleOptionProps) => {
  const classes = useStyles();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const onToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Grid container={true} className={classes.root}>
      <Paper variant="outlined" square={true} className={classes.paper}>
        <Grid container={true} alignItems="center" className={classes.header}>
          <Grid item={true} container={true} xs={6} alignItems="center">
            <Typography>
              {`Option ${index}`}
            </Typography>
          </Grid>
          <Grid item={true} container={true} xs={6} justify="flex-end">
            {isCollapsed ? (
              <KeyboardArrowUp color="primary" fontSize="large" onClick={onToggleCollapse}/>
            ) : (
              <KeyboardArrowDown color="primary" fontSize="large" onClick={onToggleCollapse}/>
            )}
          </Grid>
        </Grid>
      </Paper>
      {!isCollapsed && (
        <Paper variant="outlined" square={true} className={classes.paper}>
          <EditOption
            intents={intents}
            option={option}
            onEditOption={onEditOption}
            onDeleteOption={onDeleteOption}
          />
        </Paper>
      )}
    </Grid>
  );
};

export default CollapsibleOption;
