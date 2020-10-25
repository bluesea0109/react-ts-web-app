import { BaseAgentAction, EAgentActionTypes } from '@bavard/agent-config';
import { Box, createStyles, Grid, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import { Delete, Edit, KeyboardArrowDown, KeyboardArrowRight } from '@material-ui/icons';
import React, { useCallback, useState } from 'react';
import ActionDetailPanel from './ActionDetailPanel';

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
  }));

interface CollapsibleActionProps {
  action: BaseAgentAction;
  onEdit: (action: BaseAgentAction) => void;
  onDelete: (action: BaseAgentAction) => void;
}

const CollapsibleAction = ({
  action,
  onEdit,
  onDelete,
}: CollapsibleActionProps) => {
  const classes = useStyles();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const actionType = (() => {
    switch (action.type) {
      case EAgentActionTypes.UTTERANCE_ACTION:
        return 'Utterance';
      case EAgentActionTypes.EMAIL_ACTION:
        return 'Email';
      case EAgentActionTypes.FORM_ACTION:
        return 'Form';
      default:
        return 'Utterance';
    }
  })();

  const onToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const onDeleteAction = useCallback(() => {
    return onDelete(action);
  }, [action, onDelete]);
  const onEditAction = useCallback(() => {
    return onEdit(action);
  }, [action, onEdit]);

  return (
    <Grid container={true} className={classes.root}>
      <Paper variant="outlined" square={true} className={classes.paper}>
        <Grid container={true} xs={12} className={classes.header} alignItems="center">
          <Grid item={true} container={true} xs={6} sm={6} alignItems="center">
            <Box mr={1}>
              {isCollapsed ? (
                <KeyboardArrowRight color="primary" fontSize="large" onClick={onToggleCollapse}/>
              ) : (
                <KeyboardArrowDown color="primary" fontSize="large" onClick={onToggleCollapse}/>
              )}
            </Box>
            <Typography style={{ textTransform: 'capitalize' }}>
              {action.name}
            </Typography>
          </Grid>
          <Grid item={true} xs={4} sm={4}>
            <Typography>
              {actionType}
            </Typography>
          </Grid>
          <Grid item={true} container={true} xs={2} sm={2} justify="flex-end">
            <Box mr={1}>
              <Edit onClick={onEditAction} />
            </Box>
            <Box ml={1}>
              <Delete onClick={onDeleteAction} />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      {!isCollapsed && (
        <Paper variant="outlined" square={true} className={classes.paper}>
          <ActionDetailPanel action={action} />
        </Paper>
      )}
    </Grid>
  );
};

export default CollapsibleAction;
