import { useMutation } from '@apollo/client';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AddCircleOutline, Delete, ExpandMore } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import omitDeep from 'omit-deep-lodash';
import React, { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  CREATE_TRAINING_CONVERSATION,
  UPDATE_TRAINING_CONVERSATION,
} from '../../../common-gql-queries';
import { currentAgentConfig } from '../atoms';
import TagTypeSelection from './TagTypeSelection';

interface IConversationProps {
  conversationLastindex: number;
  onSaveCallback?: () => void;
  isUpdate?: boolean;
  onCloseCallback?: () => void;
  conversation?: { actions: object[]; id: number };
}

const CreateTrainingConversations: React.FC<IConversationProps> = ({
  conversationLastindex,
  onSaveCallback,
  isUpdate,
  conversation,
  onCloseCallback,
}) => {
  let tempActionData: any[] = [];
  const userTurns: string[] = [];

  if (isUpdate && conversation && conversation.actions) {
    tempActionData = conversation.actions.map((c: any) =>
      c.isUser ? { userActions: [c] } : { agentActions: [c] },
    );
    conversation.actions.map(
      (i: any) => (userTurns[i.turn] = i.isUser ? 'user' : 'agent'),
    );
  }

  const classes = useStyles();
  const { agentId } = useParams<{ agentId: string }>();
  const [errStatus, setErrStatus] = useState('');
  const numAgentId = Number(agentId);
  const [actionData, setActionsValue] = useState<any | null>(
    isUpdate ? tempActionData : [],
  );
  const [turn, setTurns] = useState<string[]>(isUpdate ? userTurns : []);
  const [actionType, setActionType] = useState<string>('UTTER');
  const [loading, setLoding] = useState<boolean>(false);

  const [createConversation] = useMutation(CREATE_TRAINING_CONVERSATION);
  const [updateConversation] = useMutation(UPDATE_TRAINING_CONVERSATION);

  const config = useRecoilValue(currentAgentConfig);

  const intents = config?.getIntents();
  const tagsData = config?.getTagTypes();
  const actions = config?.getActions();

  const intentOption = intents?.map((intent) => intent.name) || [];
  const tags: string[] = [];

  tagsData?.forEach((item) => tags.push(item));
  const actionId = actions?.map((item, ind) => ({ text: item.name })) || [];

  const handleAddFields = (turnValue: string) => {
    const values = [...actionData];

    if (turnValue === 'user') {
      values.push({
        userActions: [{ turn: 0, intent: '', tagValues: [], utterance: '' }],
      });
    } else {
      values.push({
        agentActions: [
          { turn: 0, actionId: '', actionType: '', utterance: '' },
        ],
      });
    }

    setActionsValue(values);
    setTurns([...turn, turnValue]);
  };

  const handleOnChange = (index: number, event: any) => {
    const values = [...actionData];

    if (event.target.id === 'Utterance') {
      values[index].userActions[0].utterance = event.target.value;
    } else if (event.target.id === 'agentUtterance') {
      values[index].agentActions[0].utterance = event.target.value;
    } else if (event.target.name === 'actionType') {
      if (event.target.value === 'CUSTOM') {
        setErrStatus('Custom actions not yet supported');
        setActionType('CUSTOM');
      } else {
        setActionType('UTTER');
      }
      values[index].agentActions[0].actionType = event.target.value;
    }

    setActionsValue([...values]);
  };

  const onDelete = (index: number, event: any) => {
    const values = [...actionData];
    const turnValues = [...turn];

    turnValues.splice(index, 1);
    values.splice(index, 1);

    setActionsValue(values);
    setTurns(turnValues);
  };

  const handleOnSelect = (index: number, event: any, value: any) => {
    const values = [...actionData];

    if (event.target.id.startsWith('intent')) {
      values[index].userActions[0].intent = value;
    } else if (event.target.id.startsWith('actionId')) {
      values[index].agentActions[0].actionId = value.text;
      values[index].agentActions[0].utterance = value.text;
    }

    setActionsValue([...values]);
    setErrStatus('');
  };

  const onSubmit = async () => {
    const userActions: object[] = [];
    const agentActions: object[] = [];

    setLoding(true);

    actionData.forEach((item: any, index: number) => {
      if (item.userActions && item.userActions !== undefined) {
        item.userActions[0].turn = index;
        userActions.push(item.userActions[0]);
      } else if (item.agentActions && item.agentActions !== undefined) {
        const data = {
          turn: index,
          actionName: item.agentActions[0].actionId,
        };
        agentActions.push(data);
      }
    });

    const userActionsValid = validateUserActions(userActions);
    const agentActionsValid = validateAgentActions(agentActions);

    if (!userActionsValid) {
      setLoding(false);
    } else if (!agentActionsValid) {
      setLoding(false);
    } else {
      try {
        let response;

        if (isUpdate) {
          agentActions.map((i: any) => i.isAgent && delete i.isAgent);
          userActions.map((i: any) => i.isUser && delete i.isUser);

          const updatedUserActions = userActions.map(item => {
            const result = omitDeep(item, '__typename');
            return result;
          });

          response = await updateConversation({
            variables: {
              conversationId: conversation?.id,
              conversation: {
                agentId: numAgentId,
                agentActions,
                userActions: updatedUserActions,
              },
            },
          });
        } else {
          response = await createConversation({
            variables: {
              conversation: {
                agentId: numAgentId,
                agentActions,
                userActions,
              },
            },
          });
        }

        if (response && response !== []) {
          setActionsValue([]);
          setTurns([]);
          setLoding(false);
          if (onSaveCallback) {
            onSaveCallback();
          }
        }
      } catch (e) {
        if (
          e?.graphQLErrors?.[0]?.extensions?.code === 'NO_MODEL' &&
          e?.graphQLErrors?.[0]?.message
        ) {
          setErrStatus(e.graphQLErrors[0].message);
        } else {
          setErrStatus(e.graphQLErrors[0].message);
        }
      }
    }
  };

  const validateUserActions = (actions: any[]): boolean => {
    for (const action of actions) {
      if (!action.intent) {
        setErrStatus('User action intent is required.');
        return false;
      }
    }
    return true;
  };

  const validateAgentActions = (actions: any[]): boolean => {
    for (const action of actions) {
      if (!action.actionName) {
        setErrStatus('Agent action Name is required.');
        return false;
      }
    }
    return true;
  };

  const handleAddTags = (tagType: string, tagValue: string, index: number) => {
    const values = [...actionData];

    if (tagType && tagValue) {
      const tagValues = { tagType, value: tagValue };
      if (values[index].userActions[0].tagValues.length > 10) {
        setErrStatus('You can not add more than 10 tags');
      } else {
        if (isUpdate) {
          values[index].userActions[0] = {
            ...values[index].userActions[0],
            tagValues: [...values[index].userActions[0].tagValues, tagValues],
          };
        } else {
          values[index].userActions[0].tagValues.push(tagValues);
        }
        setActionsValue([...values]);
      }
    } else {
      setErrStatus('Please Add tagValues');
    }
  };

  const removeTags = (tagIndex: number, index: number) => {
    let values = [...actionData];
    
    let rest = values[index].userActions[0].tagValues.filter((item: any, index: number) => index !== tagIndex)  
    values[index].userActions[0].tagValues = rest
    setActionsValue([...values]);
  };

  const handleClose = () => {
    if (onCloseCallback) {
      onCloseCallback();
    }
  };

  return (
    <Dialog fullScreen={true} open={true}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton disabled={loading} edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Create a New Conversation
          </Typography>
          <Button disabled={loading} autoFocus={true} color="inherit" onClick={onSubmit}>
            {loading && (
              <CircularProgress
                color="secondary"
                size={20}
              />
            )}
            Save
          </Button>
        </Toolbar>
        {loading && <LinearProgress color="secondary" />}
      </AppBar>
      <Grid className={classes.paper}>
        {errStatus && (
          <Alert severity="error" className={classes.progressIndicator}>
            {errStatus}
          </Alert>
        )}
        {loading && <LinearProgress className={classes.progressIndicator} />}
        <Accordion
          className={classes.listItemWrapper}
          defaultExpanded={isUpdate}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography className={classes.heading}>
              Conversation {conversationLastindex}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.listItem}>
            <Grid
              container={true}
              direction={'column'}
              className={classes.paper}>
              <Grid container={true} className={classes.actionWrapper}>
                <Grid
                  container={true}
                  item={true}
                  className={classes.actionItemWrapper}>
                  <Typography> Turn </Typography>
                </Grid>
                <Grid
                  container={true}
                  item={true}
                  className={classes.ActionsHeading}>
                  <Typography> User Actions </Typography>
                  <IconButton onClick={() => handleAddFields('user')}>
                    <AddCircleOutline fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid
                  container={true}
                  item={true}
                  className={classes.ActionsHeading}>
                  <Typography> Agent Actions </Typography>
                  <IconButton onClick={() => handleAddFields('agent')}>
                    <AddCircleOutline fontSize="large" />
                  </IconButton>
                </Grid>
              </Grid>

              {actionData?.map((inputField: any, index: number) => {
                const userAction: any = inputField.userActions
                  ? inputField.userActions[0] || {}
                  : {};
                const agentAction: any = inputField.agentActions
                  ? inputField.agentActions[0] || {}
                  : {};

                return (
                  <Fragment key={`${inputField}~${index}`}>
                    <Grid
                      container={true}
                      className={clsx(
                        classes.actionWrapper,
                        inputField.agentActions && classes.agentActionWrapper,
                      )}>
                      <Grid
                        container={true}
                        item={true}
                        className={classes.actionItemWrapper}>
                        <Typography> {index} </Typography>
                      </Grid>
                      {turn[index] === 'user' || inputField.userActions ? (
                        <Grid
                          container={true}
                          item={true}
                          className={classes.actionsWrapper}>
                          <span className={classes.agentTagText}>
                            User Action
                          </span>
                          <Grid
                            container={true}
                            className={classes.actionDetailsWrapper}
                            direction={'column'}>
                            <Grid container={true}>
                              <Grid
                                item={true}
                                className={classes.controlsWidth}>
                                <Autocomplete
                                  id="intent"
                                  options={intentOption}
                                  getOptionLabel={(option) => option || ''}
                                  onChange={(event: any, value: any) =>
                                    handleOnSelect(index, event, value)
                                  }
                                  value={userAction.intent}
                                  getOptionSelected={(a) =>
                                    a.value === userAction?.intent
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Intent"
                                      variant="outlined"
                                    />
                                  )}
                                  size="small"
                                />
                              </Grid>
                              <Grid
                                item={true}
                                className={classes.UtteranceControlsWidth}>
                                <TextField
                                  id="Utterance"
                                  label="Utterance [Optional]"
                                  variant="outlined"
                                  size="small"
                                  value={userAction?.utterance}
                                  onChange={(event) =>
                                    handleOnChange(index, event)
                                  }
                                />
                              </Grid>
                            </Grid>
                            <Grid container={true} className={classes.tagList}>
                              <span className={classes.agentTagText}>Tags</span>
                              <Paper
                                component="ul"
                                className={classes.tagListWrapper}>
                                {userAction.tagValues?.map(
                                  (item: any, i: number) => {
                                    const label =
                                      item.tagType + ' : ' + item.value;
                                    return (
                                      <li key={i}>
                                        <Chip
                                          label={label}
                                          onDelete={() => removeTags(i, index)}
                                          className={classes.chip}
                                        />
                                      </li>
                                    );
                                  },
                                )}
                              </Paper>
                            </Grid>

                            <Grid
                              container={true}
                              className={classes.tagValuesWrapper}>
                              <TagTypeSelection
                                tags={tags}
                                userTags={userAction.tagValues}
                                index={index}
                                onAddTags={handleAddTags}
                              />
                              <IconButton
                                onClick={(event) => onDelete(index, event)}>
                                <Delete fontSize="large" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      ) : (
                        <Grid
                          container={true}
                          className={classes.actionsWrapper}>
                          <span className={classes.agentTagText}>
                            Agent Action
                          </span>
                          <Grid container={true} item={true}>
                            <Grid
                              container={true}
                              item={true}
                              className={classes.actionDetailsWrapper}>
                              <Grid container={true}>
                                <Grid
                                  item={true}
                                  className={classes.controlsWidth}>
                                  <Autocomplete
                                    options={
                                      actionType === 'UTTER' ? actionId : []
                                    }
                                    id="actionId"
                                    getOptionLabel={(option) =>
                                      option?.text ?? ''
                                    }
                                    onChange={(event: any, value: any) =>
                                      handleOnSelect(index, event, value)
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Action"
                                        variant="outlined"
                                      />
                                    )}
                                    size="small"
                                  />
                                </Grid>
                                <Grid
                                  item={true}
                                  className={classes.controlsWidth}>
                                  <TextField
                                    label="Utterance"
                                    variant="outlined"
                                    id="agentUtterance"
                                    size="small"
                                    value={agentAction.utterance}
                                    onChange={(event) =>
                                      handleOnChange(index, event)
                                    }
                                    disabled={false}
                                  />
                                </Grid>
                              </Grid>
                              <IconButton
                                onClick={(event) => onDelete(index, event)}>
                                <Delete fontSize="large" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Fragment>
                );
              })}
            </Grid>
            <Grid container={true} justify={'flex-end'}>
              <Button
                className={clsx(classes.saveButton, classes.buttonMargin)}
                variant="contained"
                color="primary"
                onClick={onSubmit}
                disabled={loading || actionData.length <= 0}>
                {isUpdate ? 'Update' : 'Save'}
              </Button>
              {isUpdate && (
                <Button
                  className={classes.saveButton}
                  variant="contained"
                  color="primary"
                  onClick={handleClose}>
                  Cancel
                </Button>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '100%',
    },
    appBar: {
      position: 'relative',
    },
    button: {
      margin: theme.spacing(1),
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    ActionsHeading: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '50%',
    },
    actionWrapper: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'unset',
      flexDirection: 'row',
      marginBottom: '13px',
    },
    actionsWrapper: {
      border: '1px solid #000',
      borderRadius: '3px',
      width: 'calc(50% - 50px)',
      position: 'relative',
    },
    actionItemWrapper: {
      width: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    agentActionWrapper: {
      justifyContent: 'space-between',
    },
    UtteranceControlsWidth: {
      padding: '0 3px',
      flex: '1',
      '& > div': {
        width: '100%',
      },
    },
    actionDetailsWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 10px 10px',
      flexWrap: 'unset',
    },
    tagValuesWrapper: {
      flexWrap: 'unset',
    },
    tagList: {
      marginTop: '17px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'unset',
      position: 'relative',
    },
    agentTagText: {
      position: 'absolute',
      top: '-12px',
      backgroundColor: '#fff',
      padding: '2px 6px',
      left: '9px',
      fontSize: '12px',
    },
    controlsWidth: {
      width: '20%',
      padding: '0px 3px',
      minWidth: '130px',
    },
    listItemWrapper: {
      margin: '50px 50px 20px !important',
      backgroundColor: '#fff',
      borderRadius: '5px',
    },
    saveButton: {
      width: '100px',
      marginTop: '20px',
    },
    listItem: {
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    selectControls: {
      width: '100%',
      color: 'black',
    },
    selectControlsWidth: {
      height: '56px',
      width: '30%',
      padding: '0px 3px',
      minWidth: '130px',
      overflowY: 'auto',
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    tagListWrapper: {
      display: 'flex',
      overflowX: 'auto',
      listStyle: 'none',
      padding: theme.spacing(0.5),
      margin: '0 3px',
      flex: '1',
      background: 'transparent',
      border: '1px solid #000',
      borderRadius: '3px',
      height: '40px',
    },
    addButton: {
      whiteSpace: 'nowrap',
    },
    actionListWrapper: {
      flexWrap: 'nowrap',
    },
    buttonMargin: {
      marginRight: '10px',
    },
    progressIndicator: {
      margin: '0 50px',
    },
  }),
);

export default CreateTrainingConversations;
