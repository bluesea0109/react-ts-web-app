import { Box, CircularProgress, DialogContent, Grid, LinearProgress, TextField } from '@material-ui/core';
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
import React, { useEffect, useState } from 'react';
import { ActionType, AnyAction } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { Autocomplete } from '@material-ui/lab';
import { useMutation } from '@apollo/react-hooks';
import { createActionMutation, getActionsQuery, updateActionMutation } from './gql';
import { useParams } from 'react-router-dom';

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
};

const EditAction = (props: EditActionProps) => {
  const { loading, action, onEditActionClose } = props;
  const { agentId } = useParams();
  const numAgentId = Number(agentId);

  const classes = useStyles();
  const [currentAction, setCurrentAction] = useState<Maybe<AnyAction>>(action);
  const [actionType, setActionType] = useState<Maybe<ActionType>>();

  const [createAction, createActionMutationData] = useMutation(createActionMutation(actionType ?? ""), {
    refetchQueries: [{ query: getActionsQuery, variables: { agentId: numAgentId } }],
    awaitRefetchQueries: true
  });

  const [updateAction, updateActionMutationData] = useMutation(updateActionMutation(actionType ?? ""), {
    refetchQueries: [{ query: getActionsQuery, variables: { agentId: numAgentId } }],
    awaitRefetchQueries: true
  });

  const onSaveAction = async ({ id, agentId, name, type, ...action }: AnyAction) => {
    let finalDataObj: Partial<AnyAction> = { agentId, name, type, ...action };

    if (id !== -1) {
      finalDataObj['id'] = id;

      const resp = await updateAction({
        variables: {
          agentId: numAgentId,
          actionId: id,
          ...action
        }
      });
      console.log(resp);

      onEditActionClose();

      return
    }

    const resp = await createAction({
      variables: {
        agentId: numAgentId,
        name: name,
        ...action
      }
    });
    console.log(resp);

    onEditActionClose();
  };

  useEffect(() => {
    setCurrentAction(action);
    setActionType(action?.type !== ActionType.NEW_ACTION ? action?.type : null);
  // eslint-disable-next-line
  }, [action]);

  const saveChanges = async () => {
    if (!!currentAction) {
      const finalActionObj = {
        ...currentAction,
        type: actionType
      } as any;

      await onSaveAction(finalActionObj);
    }
  };

  const isLoading = loading || createActionMutationData.loading || updateActionMutationData.loading;
  const error = createActionMutationData.error || updateActionMutationData.error;

  return (
    <Dialog fullScreen={true} open={!!action} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton disabled={isLoading} edge="start" color="inherit" onClick={onEditActionClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {currentAction?.id === -1 ? 'Create New Action' : `Edit Action #${currentAction?.id}`}
          </Typography>
          <Button disabled={isLoading} autoFocus={true} color="inherit" onClick={saveChanges}>
            {isLoading && (
              <CircularProgress
                color="secondary"
                size={20}
              />
            )}
            {!isLoading && (currentAction?.id === -1 ? 'Create' : 'Save')}
          </Button>
        </Toolbar>
        {isLoading && <LinearProgress color="secondary" />}
      </AppBar>
      <DialogContent>
        <Box my={4}>
          <Grid container>
            <Grid item xs={6}>
              <Box p={2}>
                <TextField
                  fullWidth
                  label={`Action Name ${currentAction?.id !== -1 ? "(Read-Only)" : ""}`}
                  disabled={isLoading}
                  variant="outlined"
                  value={currentAction?.name}
                  onChange={currentAction?.id === -1 ? e => setCurrentAction({ ...currentAction, name: e.target.value }) : undefined}
                  error={!!error}
                  helperText="You can't update this field for an action once created"
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box p={2}>
                <Autocomplete
                  fullWidth
                  disabled={isLoading}
                  id="actionTypeSelector"
                  options={[ActionType.UTTERANCE_ACTION]}
                  getOptionLabel={(option: any) => option}
                  value={actionType ?? currentAction?.type ?? null}
                  onChange={(e, actionType) => setActionType(actionType as ActionType)}
                  renderInput={(params) => <TextField {...params} label="Action Type" variant="outlined" />}
                />
              </Box>
            </Grid>
            {!!currentAction && (
              <>
                {actionType === ActionType.UTTERANCE_ACTION && (
                  <>
                    <Grid item xs={6}>
                      <Box p={2}>
                        <TextField
                          fullWidth
                          multiline
                          label="Utterance Text"
                          disabled={isLoading}
                          variant="outlined"
                          rows={3}
                          value={currentAction?.text}
                          onChange={e => setCurrentAction({ ...currentAction, text: e.target.value })}
                          error={!!error}
                        />
                      </Box>
                    </Grid>
                  </>
                )}
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditAction;
