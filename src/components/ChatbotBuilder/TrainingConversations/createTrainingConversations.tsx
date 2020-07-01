import {
  Button,
  Chip,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import { AddCircleOutline, Clear, Delete, ExpandMore } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { Fragment, useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useParams } from 'react-router-dom';
import {
  CHATBOT_GET_INTENTS,
  CHATBOT_GET_TAGS,
  CHATBOT_GET_UTTERANCE_ACTIONS,
  CREATE_TRAINING_CONVERSATIONS,
  UPDATE_TRAINING_CONVERSATIONS,
} from '../../../common-gql-queries';
import { IIntent, ITagType, IUtteranceAction } from '../../../models/chatbot-service';
import TagTypeSelection from './TagTypeSelection';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '100%',
    },
    button: {
      margin: theme.spacing(1),
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    actionWrapper: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'unset',
      flexDirection: 'row',
    },
    actionItemWrapper: {
      width: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionDetailsWrapper: {
      width: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      padding: '10px 0',
    },
    tagList: {
      marginTop: '3px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'unset',
    },
    controlsWidth: {
      width: '20%',
      padding: '0px 3px',
      minWidth: '130px',
    },
    listItemWrapper: {
      margin: '0px 50px !important',
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
      margin: '0 10px 0 3px',
    },
    addButton: {
      whiteSpace: 'nowrap',
    },
    actionListWrapper: {
      flexWrap: 'nowrap',
    },

  }));

interface IGetTags {
  ChatbotService_tagTypes: ITagType[] | undefined;
}

interface IGetIntents {
  ChatbotService_intents: IIntent[] | undefined;
}

interface IGetUtteranceActions {
  ChatbotService_utteranceActions: IUtteranceAction[] | undefined;
}

interface IConversationProps {
  conversationLastindex:  number;
  onSaveCallback?: () => void;
  isUpdate?: boolean;
  conversation?: { actions: object[], id: number };
}

const CreateTrainingConversations: React.FC<IConversationProps> = ({conversationLastindex, onSaveCallback, isUpdate,  conversation}) => {
  let tempActionData: any[] = [];
  const userTurns: string[] = [];
  if (isUpdate && conversation && conversation.actions) {
    tempActionData = conversation.actions.map((c: any) => c.isUser ? ({userActions: [c]}) : ({agentActions: [c]}));
    conversation.actions.map((i: any) => {
      userTurns[i.turn] = i.isUser ? 'user' : 'agent';
    });
  }
  const classes = useStyles();
  const { agentId } = useParams();
  const [errStatus, setErrStatus] = useState('');
  const numAgentId = Number(agentId);
  const [actionData, setActionsValue] = useState<any | null>(isUpdate ? tempActionData : []);
  const [turn, setTurns] = useState<string[]>(isUpdate ? userTurns : []);
  const [usersTagValues, setUserTagValues] = useState<any | null>([]);
  const [createConversations, { loading }] = useMutation(CREATE_TRAINING_CONVERSATIONS);
  const [updateConversations] = useMutation(UPDATE_TRAINING_CONVERSATIONS);
  const intentsData = useQuery<IGetIntents>(CHATBOT_GET_INTENTS, { variables: { agentId: numAgentId } });
  const tagsData = useQuery<IGetTags>(CHATBOT_GET_TAGS, { variables: { agentId: numAgentId } });
  const actionsData = useQuery<IGetUtteranceActions>(CHATBOT_GET_UTTERANCE_ACTIONS, { variables: { agentId: numAgentId } });
  const intents = intentsData.data && intentsData.data.ChatbotService_intents || [];
  const tags = tagsData.data && tagsData.data.ChatbotService_tagTypes || [];
  const intentOption = intents?.map(i => i.value || []) || [];
  const actions = actionsData.data?.ChatbotService_utteranceActions;
  const actionId = actions !== undefined ?  actions?.map(item => ({id: item.id, value: item.text})) : [];

  const handleAddFields = (turnValue: string) => {
    const values = [...actionData];
    if (turnValue === 'user') {
      values.push({
        userActions: [{ turn:  turn.length, intent: '', tagValues: [], utterance: '' }],
      });
    } else {
      values.push({
        agentActions: [{ turn:  turn.length, actionId: '', actionType: '', utterance: '' }] ,
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
      values[index].agentActions[0].actionType = event.target.value;
    }
    setActionsValue([...values]);
    setErrStatus('');
  };

  const onDelete = (index: number, event: any) => {
    const values = [...actionData];
    values.splice(index, 1);
    setActionsValue(values);
  };

  const handleOnSelect = (index: number, event: any, value: any) => {
    const values = [...actionData];
    if (event.target.id.startsWith('intent')) {
      values[index].userActions[0].intent = value;
    } else if (event.target.id.startsWith('actionId')) {
      values[index].agentActions[0].actionId = value.id;
    }
    setActionsValue([...values]);
    setErrStatus('');
  };

  const  onclick = async () => {
    const userActions: object[] = [];
    const agentActions: object[] = [];
    actionData.forEach((item: any) => {
      if (item.userActions && item.userActions !== undefined) {
        userActions.push(item.userActions[0]);
      } else if (item.agentActions && item.agentActions !== undefined) {
        agentActions.push(item.agentActions[0]);
      }
    });

    // Validations
    const checkUser = userActions.map(item => CheckEmpty(item));
    const checkAgent = agentActions.map(item => CheckEmpty(item));

    if (checkUser.includes(false)) {
      setErrStatus('Please Fill all the details of user actions');
    } else if (checkAgent.includes(false)) {
      setErrStatus('Please Fill all the details of agent actions');
    } else {
      try {
        let response;
        if (isUpdate) {
          agentActions.map((i: any) => i.isAgent && delete i.isAgent);
          userActions.map((i: any) => i.isUser && delete i.isUser);
           response = await updateConversations({
            variables: {
                conversationId: conversation?.id,
                agentId: numAgentId,
                agentActions,
                userActions,
            },
          });
        } else {
           response = await createConversations({
            variables: {
              conversation : {
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
          if (onSaveCallback) {
            onSaveCallback();
          }
        }
      } catch (e) {
        if (e?.graphQLErrors?.[0]?.extensions?.code === 'NO_MODEL' && e?.graphQLErrors?.[0]?.message) {
          setErrStatus(e.graphQLErrors[0].message);
        } else {
          setErrStatus(e.graphQLErrors[0].message);
        }
      }
    }
  };

  const CheckEmpty = (obj: object) => {
    return Object.entries(obj).every(([k, v]) => v !== '' && v !== []);
  };

  const onAddTags = (tagType: string, tagValue: string, index: number) => {
    const values = [...actionData];
    const tagValues = {tagType, value: tagValue};
    if (usersTagValues.length > 10) {
      setErrStatus('You can not add more than 10 tags');
    } else {
      values[index].userActions[0].tagValues.push(tagValues);
      setActionsValue([...values]);
    }
  };

  const removeTags = (index: number) => {
    const values = [...usersTagValues];
    values.splice(index, 1);
    setUserTagValues(values);
  };

  return (
    <Paper className={classes.paper}>
      {errStatus && <Alert severity="error">{errStatus}</Alert>}
       {loading && <LinearProgress />}
      <ExpansionPanel className={classes.listItemWrapper} defaultExpanded={isUpdate}>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography className={classes.heading}>Conversation {conversationLastindex}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.listItem}>
          <Grid direction={'column'} className={classes.paper}>
            <Grid container={true} className = {classes.actionWrapper}>
              <Grid container={true} item={true} className = {classes.actionItemWrapper}>
                <Typography> Turn </Typography>
              </Grid>
              <Grid container={true} item={true} className = {classes.actionDetailsWrapper}>
                <Typography> User Actions </Typography>
                <IconButton onClick={() => handleAddFields('user')}>
                  <AddCircleOutline fontSize="large" />
                </IconButton>
              </Grid>
              <Grid container={true} item={true} className = {classes.actionDetailsWrapper}>
                <Typography> Agent Actions </Typography>
                <IconButton onClick={() => handleAddFields('agent')}>
                  <AddCircleOutline fontSize="large" />
                </IconButton>
              </Grid>
            </Grid>

            { actionData?.map((inputField: any, index: number) => {
              const userAction: any = inputField.userActions ? inputField.userActions[0] || {} : {};
              const agentAction: any = inputField.agentActions ? inputField.agentActions[0] || {} : {};
              return (
                <Fragment key={`${inputField}~${index}`}>
                  <Grid container={true} className = {classes.actionWrapper}>
                    <Grid container={true} item={true} className = {classes.actionItemWrapper}>
                      <Typography> {index} </Typography>
                    </Grid>
                    {
                      (turn[index] === 'user' || (inputField.userActions)) ?
                        (
                          <Grid container={true} item={true} className = {classes.actionDetailsWrapper}>
                            <Grid container={true} className={classes.actionListWrapper}>
                              <Grid item={true} className={classes.controlsWidth}>
                                <Autocomplete
                                  id="intent"
                                  options={intentOption}
                                  getOptionLabel={(option) => option || ''}
                                  onChange={(event: any, value: any) => handleOnSelect(index, event, value)}
                                  value={userAction.intent}
                                  getOptionSelected={(a) => a.value === userAction?.intent}
                                  renderInput={(params) => <TextField {...params} label="Intent" variant="outlined" />}
                                />
                              </Grid>
                              <Grid item={true} className={classes.controlsWidth}>
                                <TextField
                                  id="Utterance"
                                  label="Utterance"
                                  variant="outlined"
                                  value={userAction?.utterance}
                                  onChange={event => handleOnChange(index, event)}
                                />
                              </Grid>
                                <TagTypeSelection tags={tags} onAddTags={(tagType, tagValue) => onAddTags(tagType, tagValue, index)}/>
                              <IconButton onClick={event => onDelete(index, event)}>
                                <Delete fontSize="large" />
                              </IconButton>
                            </Grid>
                            <Grid container={true} className={classes.tagList}>
                              <Paper component="ul" className={classes.tagListWrapper}>
                                {
                                  userAction.tagValues.map((item: any, index: number) => {
                                    const label = item.tagType + ' : ' + item.value;
                                    return (
                                      <li key={index}>
                                        <Chip
                                          label={label}
                                          onDelete={() => removeTags(index)}
                                          className={classes.chip}
                                        />
                                      </li>
                                    );
                                  })
                                }
                              </Paper>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid container={true} item={true} justify={'flex-end'}>
                            <Grid  item={true} className = {classes.actionDetailsWrapper}>
                              <Grid item={true} className={classes.controlsWidth}>
                                <Autocomplete
                                  options={actionId}
                                  id="actionId"
                                  value={{
                                    id: agentAction.actionId,
                                    value: actionId.find(a => a.id === agentAction.actionId)?.value,
                                  }}
                                  getOptionLabel={(option) => option.value || ''}
                                  getOptionSelected={(a, b) => a.id === b.id}
                                  onChange={(event: any, value: any) => handleOnSelect(index, event, value)}
                                  renderInput={(params) => <TextField {...params} label="Action Id" variant="outlined" />}
                                />
                              </Grid>
                              <Grid item={true} className={classes.controlsWidth}>
                                <FormControl variant="outlined" className={classes.selectControls}>
                                  <InputLabel id="action-label">
                                    Action Type
                                  </InputLabel>
                                  <Select
                                    labelId="action-label"
                                    label="Action Type"
                                    name="actionType"
                                    value={agentAction.actionType}
                                    onChange={event => handleOnChange(index, event)}
                                  >
                                    <MenuItem  value={'UTTER'}>UTTER</MenuItem>
                                    <MenuItem  value={'CUSTOM'}>CUSTOM</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item={true} className={classes.controlsWidth}>
                                <TextField
                                  label="Utterance"
                                  variant="outlined"
                                  id="agentUtterance"
                                  value={agentAction.utterance}
                                  onChange={event => handleOnChange(index, event)}
                                />
                              </Grid>
                              <IconButton onClick={event => onDelete(index, event)}>
                                <Delete fontSize="large" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        )
                    }
                  </Grid>
                </Fragment>
              );
            })}
          </Grid>
          <Button
            className={classes.saveButton}
            variant="contained"
            color="primary"
            onClick={onclick}
            disabled={loading || actionData.length <= 0 }
          >
            {isUpdate ? 'Update' : 'Save'}
          </Button>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Paper>
  );
};

export default CreateTrainingConversations;
