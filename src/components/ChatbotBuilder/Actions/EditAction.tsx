import { BaseAgentAction, EAgentActionTypes, IResponseOption, UtteranceAction } from '@bavard/agent-config';
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
import React, { useEffect, useState } from 'react';
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

const EditAction = ({ action, isNewAction, onSaveAction, onEditActionClose }: EditActionProps) => {
  const classes = useStyles();
  const [currentAction, setCurrentAction] = useState<Maybe<BaseAgentAction>>(action);

  useEffect(() => {
    setCurrentAction(action);
  }, [action]);

  const saveChanges = () => {
    if (!currentAction) { return; }
    onSaveAction(currentAction);
  };

  const onSaveOptions = (options: IResponseOption[]) => {
    setCurrentAction({ ...currentAction, options } as BaseAgentAction);
  };

  return (
    <Dialog fullScreen={true} open={!!action} TransitionComponent={Transition}>
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
                  onChange={(e, actionType) => setCurrentAction({ ...currentAction, type: actionType } as BaseAgentAction)}
                  renderInput={(params) => <TextField {...params} label="Action Type" variant="outlined" />}
                />
              </Box>
            </Grid>
            {!!currentAction && (
              <>
                {currentAction.type === EAgentActionTypes.UTTERANCE_ACTION && (
                  <Grid item={true} xs={12}>
                    <Box p={2}>
                      <RichTextInput
                        label="Action Text"
                        value={(currentAction as UtteranceAction)?.utterance}
                        onChange={(html: string) => setCurrentAction({ ...currentAction, utterance: html } as UtteranceAction)}
                      />
                    </Box>
                  </Grid>
                )}
              </>
            )}
          </Grid>
          <Grid container={true}>
            <Grid item={true} xs={12}>
              {!!currentAction && !!currentAction.options && (
                <Option onSave={onSaveOptions}/>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditAction;
