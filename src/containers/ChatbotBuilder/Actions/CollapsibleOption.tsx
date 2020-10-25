import { IIntent, IResponseOption } from '@bavard/agent-config';
import { Box, createStyles, Grid, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import React, { useState } from 'react';

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
  option: IResponseOption;
  intents: IIntent[];
}

const CollapsibleOption = ({
  option,
  intents,
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
            <Box mr={1}>
              <Typography style={{ textTransform: 'capitalize' }}>
                {option.type}
              </Typography>
            </Box>
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
        <Paper variant="outlined" square={true}/>
      )}
    </Grid>
  );
};

export default CollapsibleOption;
