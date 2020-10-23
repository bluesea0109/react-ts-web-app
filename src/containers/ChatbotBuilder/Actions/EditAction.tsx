import {
  AgentUtteranceAction,
  BaseAgentAction,
  EAgentActionTypes,
  EmailAction,
  IResponseOption,
} from '@bavard/agent-config';
import {
  Box,
  DialogContent,
  Grid,
  TextField,
} from '@material-ui/core';
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
import { Autocomplete } from '@material-ui/lab';
import React, { Fragment, useEffect, useState } from 'react';
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
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
          value={(currentAction as AgentUtteranceAction)?.utterance || ''}
          onChange={(html: string) => setCurrentAction({ ...currentAction, utterance: html } as AgentUtteranceAction)}
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

  return (
    <Dialog fullScreen={true} open={!!currentAction} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onEditActionClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {isNewAction ? 'Create New Action' : `Edit Action: ${currentAction?.name}`}
          </Typography>
          <Button autoFocus={true} color="inherit" onClick={saveChanges}>
            {isNewAction ? 'Create' : 'Save'}
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Box my={4}>
          <Grid container={true}>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <TextField
                  fullWidth={true}
                  label="Action Name"
                  variant="outlined"
                  value={currentAction?.name}
                  onChange={isNewAction ? e => setCurrentAction({ ...currentAction, name: e.target.value } as BaseAgentAction) : undefined}
                />
              </Box>
            </Grid>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <Autocomplete
                  fullWidth={true}
                  id="actionTypeSelector"
                  options={[EAgentActionTypes.EMAIL_ACTION, EAgentActionTypes.UTTERANCE_ACTION]}
                  getOptionLabel={(option: any) => option}
                  value={currentAction?.type ?? null}
                  onChange={(_, actionType) => setCurrentAction({ ...currentAction, type: actionType } as BaseAgentAction)}
                  renderInput={(params) => <TextField {...params} label="Action Type" variant="outlined" />}
                />
              </Box>
            </Grid>
            {currentAction?.type === EAgentActionTypes.UTTERANCE_ACTION && _renderUtteranceFields()}
            {currentAction?.type === EAgentActionTypes.EMAIL_ACTION && _renderEmailFields()}
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditAction;
