import {
  AgentUtteranceAction,
  EmailAction,
  EResponseOptionTypes,
  FormAction,
  IAgentAction,
  IAgentFormAction,
  ITextOption,
} from '@bavard/agent-config';
import {
  EAgentActionTypes,
  EFormFieldTypes,
} from '@bavard/agent-config/dist/enums';
import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { DropDown, FullDialog, TextInput } from '../../../components';
import EditEmailAction from './EditEmailAction';
import EditFormAction from './EditFormAction';
import EditUtteranceAction from './EditUtteranceAction';
import Options from './Options';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  action: IAgentAction;
  isNewAction: boolean;
  onSaveAction: (agentAction: IAgentAction) => void;
  onEditActionClose: () => void;
};

const EditAction = ({
  action,
  isNewAction,
  onSaveAction,
  onEditActionClose,
}: EditActionProps) => {
  const classes = useStyles();
  const [currentAction, setCurrentAction] = useState<IAgentAction>(action);

  useEffect(() => {
    setCurrentAction(action);
  }, [action]);

  const saveChanges = () => {
    if (!currentAction || !currentAction.type) {
      return;
    }
    onSaveAction(currentAction);
  };

  const handleUpdateActionType = (type: string) => {
    const newAction = { ...currentAction, type } as IAgentAction;
    if (type === EAgentActionTypes.FORM_ACTION) {
      (newAction as IAgentFormAction).url = '';
      (newAction as IAgentFormAction).fields = [
        {
          name: 'Your Name',
          type: EFormFieldTypes.TEXT,
          required: true,
        },
        {
          name: 'Your Email',
          type: EFormFieldTypes.EMAIL,
          required: false,
        },
        {
          name: 'Your Phone',
          type: EFormFieldTypes.PHONE,
          required: false,
        },
        {
          name: 'Your ZIP',
          type: EFormFieldTypes.ZIP,
          required: false,
        },
      ];
    }

    setCurrentAction(newAction);
  };

  const handleOptionCreate = () => {
    setCurrentAction({
      ...currentAction,
      options: [
        ...currentAction.options,
        {
          text: '',
          type: EResponseOptionTypes.TEXT,
        } as ITextOption,
      ],
    });
  };

  const ActionTypes = [
    EAgentActionTypes.EMAIL_ACTION,
    EAgentActionTypes.UTTERANCE_ACTION,
    EAgentActionTypes.FORM_ACTION,
  ].map((type) => ({
    id: type,
    name: type,
  }));

  return (
    <FullDialog
      isOpen={!!currentAction}
      title={
        isNewAction ? 'Add a New Action' : `Edit Action: ${currentAction?.name}`
      }
      onEditClose={onEditActionClose}>
      <Grid container={true} justify="center" className={classes.rootGrid}>
        <Grid container={true} item={true} sm={6} xs={4}>
          <Grid
            container={true}
            item={true}
            sm={12}
            justify="flex-start"
            className={classes.formField}>
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
              onChange={
                isNewAction
                  ? (e) =>
                      setCurrentAction({
                        ...currentAction,
                        name: e.target.value,
                      })
                  : undefined
              }
            />
          </Grid>
          <Grid
            container={true}
            item={true}
            sm={12}
            className={classes.formField}>
            <DropDown
              fullWidth={true}
              label="Action Type"
              labelPosition="left"
              menuItems={ActionTypes}
              current={currentAction?.type}
              padding="12px"
              onChange={(actionType) => handleUpdateActionType(actionType)}
            />
          </Grid>
          {currentAction?.type === EAgentActionTypes.UTTERANCE_ACTION && (
            <EditUtteranceAction
              action={currentAction as AgentUtteranceAction}
              onChangeAction={(action) => setCurrentAction(action)}
            />
          )}
          {currentAction?.type === EAgentActionTypes.EMAIL_ACTION && (
            <EditEmailAction
              action={currentAction as EmailAction}
              onChangeAction={(action) => setCurrentAction(action)}
            />
          )}
          {currentAction?.type === EAgentActionTypes.FORM_ACTION && (
            <EditFormAction
              action={currentAction as FormAction}
              onChangeAction={(action) => setCurrentAction(action)}
            />
          )}
          <Grid container={true} item={true} xs={12}>
            {!!currentAction && !!currentAction.options && (
              <Options
                options={currentAction.options}
                onCreateOption={handleOptionCreate}
                onBulkUpdate={(options) =>
                  setCurrentAction({ ...currentAction, options })
                }
              />
            )}
          </Grid>
          <Grid container={true} item={true} xs={12} justify="center">
            <Button
              autoFocus={true}
              color="primary"
              variant="contained"
              onClick={saveChanges}>
              {isNewAction ? 'Add Action' : 'Update Action'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </FullDialog>
  );
};

export default EditAction;
