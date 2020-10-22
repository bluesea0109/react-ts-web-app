import {
  BaseAgentAction,
  EAgentActionTypes,
  EmailAction,
  IResponseOption,
  UtteranceAction,
} from '@bavard/agent-config';
import {
  AppBar,
  Box,
  Button,
  createStyles,
  Dialog,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { Fragment, useEffect, useState } from 'react';
import { DropDown, TextInput } from '../../../components';
import { UpTransition } from '../../../components';
import { Maybe } from '../../../utils/types';
import RichTextInput from '../../Utils/RichTextInput';
import Option from './Option';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    input: {
      '& .MuiOutlinedInput-input': {
        padding: '12px 12px',
      },
    },
    rootGrid: {
      padding: theme.spacing(2),
    },
    grid: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
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

  const onAddOption = (option: IResponseOption) => {
    setCurrentAction({
      ...currentAction,
      options: [...(currentAction?.options || []), option],
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

  const _renderUtteranceFields = () => (
    <Grid item={true} xs={12}>
      <Box p={2}>
        <RichTextInput
          label="Action Text"
          value={(currentAction as UtteranceAction)?.utterance || ''}
          onChange={(html: string) => setCurrentAction({ ...currentAction, utterance: html } as UtteranceAction)}
        />
      </Box>
    </Grid>
  );

  const _renderEmailFields = () => (
    <Fragment>
      <Grid item={true} xs={12}>
        <Box p={2}>
          <TextField
            fullWidth={true}
            label="Email Prompt"
            variant="outlined"
            value={(currentAction as EmailAction)?.prompt}
            onChange={e => setCurrentAction({ ...currentAction, prompt: e.target.value } as EmailAction)}
          />
        </Box>
      </Grid>
      <Grid item={true} xs={6}>
        <Box p={2}>
          <TextField
            fullWidth={true}
            label="Email From"
            type="email"
            variant="outlined"
            value={(currentAction as EmailAction)?.from}
            onChange={e => setCurrentAction({ ...currentAction, from: e.target.value } as EmailAction)}
          />
        </Box>
      </Grid>
      <Grid item={true} xs={6}>
        <Box p={2}>
          <TextField
            fullWidth={true}
            label="Email To"
            type="email"
            variant="outlined"
            value={(currentAction as EmailAction)?.to}
            onChange={e => setCurrentAction({ ...currentAction, to: e.target.value } as EmailAction)}
          />
        </Box>
      </Grid>
    </Fragment>
  );

  const ActionTypes = [{
    id: 1,
    name: EAgentActionTypes.EMAIL_ACTION,
  }, {
    id: 2,
    name: EAgentActionTypes.UTTERANCE_ACTION,
  }, {
    id: 3,
    name: EAgentActionTypes.FORM_ACTION,
  }];

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
          <Grid container={true} item={true} sm={12} justify="flex-start" className={classes.grid}>
            <Typography variant="h6">
              Add an Action to customize your Assistant’s behavior:
            </Typography>
          </Grid>
          <Grid container={true} item={true} sm={12} className={classes.grid}>
            <Typography variant="h6" style={{fontWeight: 'bold'}}>
              Action Name
            </Typography>
            <TextInput
              fullWidth={true}
              variant="outlined"
              value={currentAction?.name}
              className={classes.input}
              onChange={isNewAction ? e => setCurrentAction({ ...currentAction, name: e.target.value } as BaseAgentAction) : undefined}
            />
          </Grid>
          <Grid container={true} item={true} sm={12} className={classes.grid}>
            <Typography variant="h6" style={{fontWeight: 'bold'}}>
              Action Type
            </Typography>
            <DropDown
              fullWidth={true}
              menuItems={ActionTypes}
              current={currentAction?.type}
              padding="12px"
              onChange={(actionType) => setCurrentAction({ ...currentAction, type: actionType } as BaseAgentAction)}
            />
          </Grid>
          <Grid container={true}>
            {currentAction?.type === EAgentActionTypes.UTTERANCE_ACTION && _renderUtteranceFields()}
            {currentAction?.type === EAgentActionTypes.EMAIL_ACTION && _renderEmailFields()}
          </Grid>
        </Grid>
        <Grid container={true}>
          <Grid item={true} xs={12}>
            {!!currentAction && !!currentAction.options && (
              <Option
                options={currentAction?.options}
                onAddOption={onAddOption}
                onDeleteOption={onDeleteOption}
                onUpdateOption={onUpdateOption}
                onSetOptions={onSetOptions}
              />
            )}
          </Grid>
        </Grid>
        <Button autoFocus={true} color="inherit" onClick={saveChanges}>
          {isNewAction ? 'Create' : 'Save'}
        </Button>
      </Grid>
    </Dialog>
  );
};

export default EditAction;
