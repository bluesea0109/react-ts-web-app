import { EFormFieldTypes, EResponseOptionTypes, FormAction, IAgentAction, IAgentFormAction } from '@bavard/agent-config';
import { AgentUtteranceAction, BaseAgentAction, EAgentActionTypes, EmailAction } from '@bavard/agent-config';
import { AppBar, Button, createStyles, Dialog, Grid, IconButton, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { DropDown, TextInput, UpTransition } from '../../../components';
import { Maybe } from '../../../utils/types';
import EditEmailAction from './EditEmailAction';
import EditFormAction from './EditFormAction';
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

  const initFormAction = (actionObj: IAgentAction) => {
    (actionObj as IAgentFormAction).url = '';
    (actionObj as IAgentFormAction).fields = [{
      name: 'Your Name',
      type: EFormFieldTypes.TEXT,
      required: true,
    }, {
      name: 'Your Email',
      type: EFormFieldTypes.EMAIL,
      required: false,
    }, {
      name: 'Your Phone',
      type: EFormFieldTypes.PHONE,
      required: false,
    }, {
      name: 'Your ZIP',
      type: EFormFieldTypes.ZIP,
      required: false,
    }];
  };

  const handleActionUpdate = (fieldName: string, fieldValue: any) => {
    if (!currentAction) { return; }
    const type = fieldName === 'type' ? fieldValue : currentAction.type;
    const actionObj = currentAction.toJsonObj();
    // @ts-ignore
    actionObj[fieldName] = fieldValue;
    if (fieldName === 'type' && type === EAgentActionTypes.FORM_ACTION) {
      initFormAction(actionObj);
    }

    let newAction = null;
    switch (type) {
      case EAgentActionTypes.EMAIL_ACTION:
        newAction = EmailAction.fromJsonObj(actionObj as any);
        break;
      case EAgentActionTypes.FORM_ACTION:
        newAction = FormAction.fromJsonObj(actionObj as any);
        break;
      case EAgentActionTypes.UTTERANCE_ACTION:
      default:
        newAction = AgentUtteranceAction.fromJsonObj(actionObj as any);
        break;
    }
    setCurrentAction(newAction);
  };

  const handleOptionCreate = () => {
    if (!currentAction) { return; }

    const newAction = _.cloneDeep(currentAction);
    newAction.options = [
      ...currentAction?.options,
      {
        name: '',
        options: [],
        type: EResponseOptionTypes.TEXT,
      } as any,
    ];
    setCurrentAction(newAction);
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
              value={currentAction?.name}
              className={classes.input}
              onChange={isNewAction ? e => handleActionUpdate('name', e.target.value) : undefined}
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
              onChange={(actionType) => handleActionUpdate('type', actionType)}
            />
          </Grid>
          {currentAction?.type === EAgentActionTypes.UTTERANCE_ACTION && (
            <EditUtteranceAction
              action={currentAction as AgentUtteranceAction}
              onChangeAction={(field, value) => handleActionUpdate(field, value)}
            />
          )}
          {currentAction?.type === EAgentActionTypes.EMAIL_ACTION && (
            <EditEmailAction
              action={currentAction as EmailAction}
              onChangeAction={(field, value) => handleActionUpdate(field, value)}
            />
          )}
          {currentAction?.type === EAgentActionTypes.FORM_ACTION && (
            <EditFormAction
              action={currentAction as FormAction}
              onChangeAction={(field, value) => handleActionUpdate(field, value)}
            />
          )}
          <Grid container={true} item={true} xs={12}>
            {!!currentAction && !!currentAction.options && (
              <Options
                options={currentAction.options}
                onCreateOption={handleOptionCreate}
                onSetOptions={(options) => handleActionUpdate('options', options)}
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
