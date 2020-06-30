import {
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary, FormControl,
  Grid,
  IconButton, InputLabel, LinearProgress,
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
import { AddCircleOutline, Delete, ExpandMore } from '@material-ui/icons';
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
} from '../../../common-gql-queries';
import { IIntent, ITagType, IUtteranceAction } from '../../../models/chatbot-service';

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
}

const CreateTrainingConversations: React.FC<IConversationProps> = ({conversationLastindex, onSaveCallback}) => {
  const classes = useStyles();
  const { agentId } = useParams();
  const [errStatus, setErrStatus] = useState('');
  const numAgentId = Number(agentId);
  const [actionData, setActionsValue] = useState<any | null>([]);
  const [turn, setTurns] = useState<any | null>([]);

  const [createConversations, { loading }] = useMutation(CREATE_TRAINING_CONVERSATIONS);
  const intentsData = useQuery<IGetIntents>(CHATBOT_GET_INTENTS, { variables: { agentId: numAgentId } });
  const tagsData = useQuery<IGetTags>(CHATBOT_GET_TAGS, { variables: { agentId: numAgentId } });
  const actionsData = useQuery<IGetUtteranceActions>(CHATBOT_GET_UTTERANCE_ACTIONS, { variables: { agentId: numAgentId } });
  const intents = intentsData.data && intentsData.data.ChatbotService_intents || [];
  const tags = tagsData.data && tagsData.data.ChatbotService_tagTypes || [];

  const actions = actionsData.data?.ChatbotService_utteranceActions;
  const actionId = actions !== undefined ?  actions.map(item => ({id: item.id, value: item.text})) : [];

  const handleAddFields = (turnValue: string) => {
    const values = [...actionData];
    if (turnValue === 'user') {
      values.push({
        userActions: [{ turn:  turn.length, intent: '', tagValues: [], utterance: '' }],
      });
    } else {
      values.push({
        AgentAction: [{ turn:  turn.length, actionId: '', actionType: '', utterance: '' }] ,
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
      values[index].AgentAction[0].utterance = event.target.value;
    } else if (event.target.name === 'actionType') {
      values[index].AgentAction[0].actionType = event.target.value;
    }
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
      values[index].userActions[0].intent = value.value;
    } else if (event.target.id.startsWith('tags')) {
      if (value.length > 10) {
        setErrStatus('You can not add more than 10 tags');
      } else {
        const tagValues = value.map((item: any ) => ({tagType: item.value, value: item.value}));
        values[index].userActions[0].tagValues = tagValues;
      }
    } else if (event.target.id.startsWith('actionId')) {
      values[index].AgentAction[0].actionId = value.id;
    }
    setErrStatus('');
  };

  const  onclick = async () => {
    const userActions: object[] = [];
    const agentActions: object[] = [];
    actionData.forEach((item: any) => {
      if (item.userActions && item.userActions !== undefined) {
        userActions.push(item.userActions[0]);
      } else if (item.AgentAction && item.AgentAction !== undefined) {
        agentActions.push(item.AgentAction[0]);
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
        const response = await createConversations({
          variables: {
            conversation : {
              agentId: numAgentId,
              agentActions,
              userActions,
            },
          },
        });
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

  return (
    <Paper className={classes.paper}>
      {errStatus && <Alert severity="error">{errStatus}</Alert>}
       {loading && <LinearProgress />}
      <ExpansionPanel className={classes.listItemWrapper}>
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

            { actionData.map((inputField: any, index: number) => (
              <Fragment key={`${inputField}~${index}`}>
                <Grid container={true} className = {classes.actionWrapper}>
                  <Grid container={true} item={true} className = {classes.actionItemWrapper}>
                    <Typography> {index} </Typography>
                  </Grid>
                  {
                    turn[index] === 'user' ?
                      (
                        <Grid container={true} item={true} className = {classes.actionDetailsWrapper}>
                          <Grid item={true} className={classes.controlsWidth}>
                            <Autocomplete
                              id="intent"
                              options={intents}
                              getOptionLabel={(option) => option.value}
                              onChange={(event: any, value: any) => handleOnSelect(index, event, value)}
                              renderInput={(params) => <TextField {...params} label="Intent" variant="outlined" />}
                            />
                          </Grid>
                          <Grid item={true} className={classes.selectControlsWidth}>
                            <Autocomplete
                              multiple={true}
                              id="tags"
                              options={tags}
                              getOptionLabel={(option) => option.value}
                              onChange={(event: any, value: any) => handleOnSelect(index, event, value)}
                              renderInput={(params) => <TextField {...params} label="Tag Values" variant="outlined" />}
                            />
                          </Grid>
                          <Grid item={true} className={classes.controlsWidth}>
                            <TextField
                              id="Utterance"
                              label="Utterance"
                              variant="outlined"
                              onChange={event => handleOnChange(index, event)}
                            />
                          </Grid>
                          <IconButton onClick={event => onDelete(index, event)}>
                            <Delete fontSize="large" />
                          </IconButton>
                        </Grid>
                      ) : (
                        <Grid container={true} item={true} justify={'flex-end'}>
                          <Grid  item={true} className = {classes.actionDetailsWrapper}>
                            <Grid item={true} className={classes.controlsWidth}>
                              <Autocomplete
                                options={actionId}
                                id="actionId"
                                getOptionLabel={(option) => option.value}
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
            ))}
          </Grid>
          <Button
            className={classes.saveButton}
            variant="contained"
            color="primary"
            onClick={onclick}
            disabled={loading || actionData.length <= 0 }
          >
            Save
          </Button>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Paper>
  );
};

export default CreateTrainingConversations;
