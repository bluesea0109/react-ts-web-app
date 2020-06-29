import {
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary, FormControl,
  Grid,
  IconButton, InputLabel,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import { AddCircleOutline, Delete, ExpandMore } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import React, { Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useParams } from 'react-router-dom';
import {
  CHATBOT_GET_INTENTS,
  CHATBOT_GET_TAGS,
  CHATBOT_GET_UTTERANCE_ACTIONS,
  CREATE_TRAINING_CONVERSATIONS,
} from '../../../common-gql-queries';
import { IIntent, ITagType, IUtteranceAction } from '../../../models/chatbot-service';
import AutoComplete from '../../Utils/Autocomplete';

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

export default function TrainingConversations() {
  const classes = useStyles();
  const { agentId } = useParams();
  const [errStatus, setErrStatus] = useState('');
  const [conversationList, setConversationList] = useState<any | null>([]);
  const numAgentId = Number(agentId);
  const [actionData, setActionsValue] = useState<any | null>([]);
  const [turn, setTurns] = useState<any | null>([]);

  const [userActions] = useMutation(CREATE_TRAINING_CONVERSATIONS);
  const intentsData = useQuery<IGetIntents>(CHATBOT_GET_INTENTS, { variables: { agentId: numAgentId } });
  const tagsData = useQuery<IGetTags>(CHATBOT_GET_TAGS, { variables: { agentId: numAgentId } });
  const actionsData = useQuery<IGetUtteranceActions>(CHATBOT_GET_UTTERANCE_ACTIONS, { variables: { agentId: numAgentId } });
  const intents = intentsData.data && intentsData.data.ChatbotService_intents;
  const tags = tagsData.data && tagsData.data.ChatbotService_tagTypes;
  const [tagSelectedValue, setTagSelectedValue] = useState<any | null>(null);
  const [intentSelectedValue, setIntentSelectedValue] = useState<any | null>(null);

  const actions = actionsData.data?.ChatbotService_utteranceActions;
  const actionId = actions !== undefined ?  actions.map(item => ({id: item.id, value: item.text})) : [];

  useEffect(() => {
    if (tags) {
      setTagSelectedValue(tagSelectedValue ? tagSelectedValue : tags[0]);
    }

    if (intents) {
      setIntentSelectedValue(intentSelectedValue ? intentSelectedValue : intents?.[0]?.id);
    }

    return () => {
    };

  }, [intentSelectedValue, intents, tagSelectedValue, tags]);

  const onSubmit = async () => {
    try {

      const response = await userActions({
        variables: {
          conversation : {
            agentId: numAgentId,
            agentActions: [],
            userActions: [{
              turn: 0,
              intent: intentSelectedValue?.value,
              tagValues: [{tagType: tagSelectedValue?.value,
                value: tagSelectedValue?.value }],
              utterance: 'Test',
            }],
          },
        },
      });

    } catch (e) {
      if (e?.graphQLErrors?.[0]?.extensions?.code === 'NO_MODEL' && e?.graphQLErrors?.[0]?.message) {
        setErrStatus(e.graphQLErrors[0].message);
      } else {
        setErrStatus(e.graphQLErrors[0].message);
      }
    }
  };

  const onCreateNewConversation = () => {
      const arr = [{agentId: numAgentId}];
      setConversationList(arr);
  };

  const handleAddFields = (turnValue: string) => {
      const values = [...actionData];
      values.push({
        userActions:
          turnValue === 'user' ? [{ turn:  turn.length, intent: '', tagValues: [{ tagType: '', value: '' }], utterance: '' }] : [],
        AgentAction:
          turnValue === 'agent' ? [{ turn:  turn.length, actionId: '', actionType: '', utterance: ''  }] : [],
      });
      setActionsValue(values);
      setTurns([...turn, turnValue]);
  };

  const handleOnChange = (index: number, event: any) => {
    const values = [...actionData];
    if (event.target.id === 'Utterance') {
      values[index].userActions[0].utterance = event.target.value;
    }
  };

  const onDelete = (index: number, event: any) => {
    const values = [...actionData];
    values.splice(index, 1);
    setActionsValue(values);

  };

  return (
    <Paper className={classes.paper}>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={onCreateNewConversation}
      >
        Create New Conversation
      </Button>
      {errStatus && <Alert severity="error">{errStatus}</Alert>}
      {
        conversationList.length > 0 ?
          (
            <ExpansionPanel className={classes.listItemWrapper}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMore />}
              id="conversationId"
            >
              <Typography className={classes.heading}>Conversation 1</Typography>
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
                                <AutoComplete
                                  options={intents}
                                  value={intentSelectedValue}
                                  label="intents"
                                  onChange={(event: any) => handleOnChange(index, event)}
                                />
                              </Grid>
                              <Grid item={true} className={classes.controlsWidth}>
                                <AutoComplete
                                  options={tags}
                                  value={tagSelectedValue}
                                  label="Tag Types"
                                  onChange={(event: any, newValue: any | null) => {
                                    setTagSelectedValue(newValue);
                                  }
                                  }
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
                              <Grid item={true} className={classes.controlsWidth}>
                                <TextField
                                  id="userValues"
                                  label="Values"
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
                                  <AutoComplete
                                    options={actionId}
                                    value={intentSelectedValue}
                                    label="Action Id"
                                    onChange={(event: any, newValue: any | null) => {
                                      setIntentSelectedValue(newValue);
                                    }
                                    }
                                  />
                                </Grid>
                                <Grid item={true} className={classes.controlsWidth}>
                                  <FormControl variant="outlined" className={classes.selectControls}>
                                    <InputLabel id="actionType">
                                      Action Type
                                    </InputLabel>
                                    <Select
                                       labelId="actionType"
                                       label="Action Type"
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
                onClick={onSubmit}
                disabled={true}
              >
                Save
              </Button>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          )
          : (
            <Typography align="center" variant="h6">
            {'No Conversation found'}
            </Typography>
          )
      }
    </Paper>
  );
}
