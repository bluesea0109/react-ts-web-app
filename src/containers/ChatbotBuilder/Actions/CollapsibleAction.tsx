import { BaseAgentAction, EAgentActionTypes } from '@bavard/agent-config';
import { Box, createStyles, Grid, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import { Delete, Edit, KeyboardArrowDown, KeyboardArrowRight } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useCallback } from 'react';
import ActionDetailPanel from './ActionDetailPanel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(2),
      marginBttom: theme.spacing(2),
    },
    header: {
      padding: '4px 8px 4px 4px',
    },
  }));

interface CollapsibleActionProps {
  action: BaseAgentAction;
  isOpen: boolean;
  onToggle: (action: BaseAgentAction) => void;
  onEdit: (action: BaseAgentAction) => void;
  onDelete: (action: BaseAgentAction) => void;
}

const CollapsibleAction = ({
  action,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
}: CollapsibleActionProps) => {
  const classes = useStyles();

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

  const onToggleAction = useCallback(() => {
    return onToggle(action);
  }, [action, onToggle]);
  const onDeleteAction = useCallback(() => {
    return onDelete(action);
  }, [action, onDelete]);
  const onEditAction = useCallback(() => {
    return onEdit(action);
  }, [action, onEdit]);

  return (
    <>
      <Paper variant="outlined" square={true} className={clsx(classes.paper)}>
        <Grid container={true} alignItems="center" className={clsx(classes.header)}>
          <Grid item={true} container={true} xs={6} sm={6} alignItems="center">
            <Box mr={1}>
              {isOpen ? (
                <KeyboardArrowDown color="primary" fontSize="large" onClick={onToggleAction}/>
              ) : (
                <KeyboardArrowRight color="primary" fontSize="large" onClick={onToggleAction}/>
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
      {isOpen && (
        <Paper variant="outlined" square={true}>
          <ActionDetailPanel action={action} />
        </Paper>
      )}
    </>
  );
};

export default CollapsibleAction;
