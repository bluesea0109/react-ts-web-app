import { CircularProgress, LinearProgress } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { TransitionProps } from '@material-ui/core/transitions';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useRef, useState } from 'react';
import { ActionType, AnyAction } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { ActionsError } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type EditActionProps = {
  loading: boolean;
  action?: AnyAction;
  onEditActionClose: () => void;
  onSaveAction: (updatedAction: any) => Promise<void>;
  error: Maybe<ActionsError>;
};

const EditAction = (props: EditActionProps) => {
  const { loading, action, onEditActionClose, onSaveAction, error } = props;

  const classes = useStyles();
  const [currentAction, setCurrentAction] = useState<Maybe<AnyAction>>(action);
  const [actionType, setActionType] = useState<Maybe<ActionType>>();

  useEffect(() => {
    setCurrentAction(action);
  // eslint-disable-next-line
  }, [action]);

  const saveChanges = async () => {
    if (!!currentAction) {
      const finalActionObj = {
        id: currentAction.id,
        agentId: currentAction.agentId,
      };

      await onSaveAction(finalActionObj);
    }
  };

  return (
    <Dialog fullScreen={true} open={!!action} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton disabled={loading} edge="start" color="inherit" onClick={onEditActionClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {currentAction?.id === -1 ? 'Create New Action' : `Edit Action #${currentAction?.id}`}
          </Typography>
          <Button disabled={loading} autoFocus={true} color="inherit" onClick={saveChanges}>
            {loading && (
              <CircularProgress
                color="secondary"
                size={20}
              />
            )}
            {!loading && (currentAction?.id === -1 ? 'Create' : 'Save')}
          </Button>
        </Toolbar>
        {loading && <LinearProgress color="secondary" />}
      </AppBar>
    </Dialog>
  );
};

export default EditAction;
