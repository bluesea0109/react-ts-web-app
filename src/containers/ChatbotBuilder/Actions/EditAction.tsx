import { EResponseOptionTypes } from '@bavard/agent-config';
import { AgentUtteranceAction, BaseAgentAction, EAgentActionTypes, EmailAction, IResponseOption } from '@bavard/agent-config';
import { AppBar, Button, createStyles, Dialog, Grid, IconButton, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from 'react';
import { DropDown, TextInput, UpTransition } from '../../../components';
import { Maybe } from '../../../utils/types';
import EditEmailAction from './EditEmailAction';
import EditUtteranceAction from './EditUtteranceAction';
import Options from './Options';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    rootGrid: {
      padding: theme.spacing(2),
    },
    formField: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    input: {
      '& .MuiOutlinedInput-input': {
        padding: '12px 12px',
      },
    },
  }),
);

type EditActionProps = {
  action?: BaseAgentAction;
  isNewAction: boolean;
  onSaveAction: (agentAction: BaseAgentAction) => void;
  onEditActionClose: () => void;
};

const EditAction = ({
  action,
  isNewAction,
  onSaveAction,
  onEditActionClose,
}: EditActionProps) => {
  const classes = useStyles();
  const [currentAction, setCurrentAction] = useState<Maybe<BaseAgentAction>>();

  useEffect(() => {
    setCurrentAction(action);
  }, [action]);

  const saveChanges = () => {
    if (!currentAction || !currentAction.type) { return; }
    onSaveAction(currentAction);
  };

  const onDeleteOption = (option: IResponseOption) => {
    if (!currentAction?.options) { return; }
    setCurrentAction({
      ...currentAction,
      options: [...currentAction?.options.filter(opt => opt.text !== option.text)],
    } as BaseAgentAction);
  };

  const onCreateOption = () => {
    if (!currentAction) { return; }
    setCurrentAction({
      ...currentAction,
      options: [
        ...currentAction?.options,
        {
          name: '',
          options: [],
          type: EResponseOptionTypes.TEXT,
        },
      ],
    } as BaseAgentAction);
  };

  const onUpdateOption = (text: string, option: IResponseOption) => {
    setCurrentAction({
      ...currentAction,
      options: [
        ...(currentAction?.options || []).filter(opt => opt.text !== text),
        option,
      ],
    } as BaseAgentAction);
  };

  const onSetOptions = (options: IResponseOption[]) => {
    setCurrentAction({
      ...currentAction,
      options: [...options],
    } as BaseAgentAction);
  };

  const ActionTypes = [EAgentActionTypes.EMAIL_ACTION, EAgentActionTypes.UTTERANCE_ACTION, EAgentActionTypes.FORM_ACTION].map((type) => ({
    id: type,
    name: type,
  }));

  return (
    <Dialog fullScreen={true} open={!!currentAction} TransitionComponent={UpTransition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {isNewAction ? 'Add a New Action' : `Edit Action: ${currentAction?.name}`}
          </Typography>
          <IconButton edge="start" color="inherit" onClick={onEditActionClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid container={true} justify="center" className={classes.rootGrid}>
        <Grid container={true} item={true} sm={6} xs={4}>
          <Grid container={true} item={true} sm={12} justify="flex-start" className={classes.formField}>
            <Typography variant="h6">
              Add an Action to customize your Assistant’s behavior:
            </Typography>
          </Grid>
          <Grid item={true} sm={12} className={classes.formField}>
            <TextInput
              fullWidth={true}
              label="Action Name"
              variant="outlined"
              value={currentAction?.name}
              className={classes.input}
              onChange={isNewAction ? e => setCurrentAction({ ...currentAction, name: e.target.value } as BaseAgentAction) : undefined}
            />
          </Grid>
          <Grid container={true} item={true} sm={12} className={classes.formField}>
            <DropDown
              fullWidth={true}
              label="Action Type"
              labelPosition="left"
              menuItems={ActionTypes}
              current={currentAction?.type}
              padding="12px"
              onChange={(actionType) => setCurrentAction({ ...currentAction, type: actionType } as BaseAgentAction)}
            />
          </Grid>
          <Grid container={true}>
            {currentAction?.type === EAgentActionTypes.UTTERANCE_ACTION && (
              <EditUtteranceAction
                action={currentAction as AgentUtteranceAction}
                onChangeAction={action => setCurrentAction(action)}
              />
            )}
            {currentAction?.type === EAgentActionTypes.EMAIL_ACTION && (
              <EditEmailAction
                action={currentAction as EmailAction}
                onChangeAction={action => setCurrentAction(action)}
              />
            )}
          </Grid>
          <Grid container={true} item={true} xs={12}>
            {!!currentAction && !!currentAction.options && (
              <Options
                options={currentAction.options}
                onCreateOption={onCreateOption}
              />
            )}
          </Grid>
          <Grid container={true} item={true} xs={12} justify="center">
            <Button autoFocus={true} color="primary" variant="contained" onClick={saveChanges}>
              {isNewAction ? 'Add Action' : 'Update Action'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default EditAction;
