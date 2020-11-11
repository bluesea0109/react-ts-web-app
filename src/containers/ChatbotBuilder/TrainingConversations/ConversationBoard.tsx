import { useMutation } from '@apollo/client';
import {
  AccordionDetails,
  Box,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/core/styles';
import { KeyboardArrowDown, KeyboardArrowRight } from '@material-ui/icons';
import { AddCircleOutline, Delete } from '@material-ui/icons';
import clsx from 'clsx';
import omitDeep from 'omit-deep-lodash';
import React, { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  CREATE_TRAINING_CONVERSATION,
  UPDATE_TRAINING_CONVERSATION,
} from '../../../common-gql-queries';
import { ConfirmDialog } from '../../../components';
import { currentAgentConfig } from '../atoms';
import { ACTION, DialogueForm } from './DialogueForm';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    justifyContent: 'center',
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    padding: '20px',
  },
  actionWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'unset',
    flexDirection: 'row',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    paddingTop: '5px',
  },
  listItem: {
    borderTop: '1px solid rgba(0,0,0,.2)',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  UserActionsHeading: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '50%',
  },
  AgentActionsHeading: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '50%',
  },
  listItemWrapper: {
    border: '1px solid rgba(0,0,0,0.2)',
    boxShadow: 'none',

    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: '0px',
    },
    marginBottom: '30px',
  },
  actionButtonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& button': {
      '& span': {
        '& svg': {
          fontSize: '22px',
        },
      },
    },
  },
  actionItemWrapper: {
    width: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentActionWrapper: {
    justifyContent: 'space-between',
    margin: '12px 0 10px',
  },
  itemWrapper: {
    display: 'flex',
    marginRight: '10px',
    marginLeft: '10px',
    padding: '0 5px',
    '& h6': {
      margin: '0 8px 0 0',
      fontWeight: '600',
      color: '#333',
      fontSize: '16px',
    },
    '& p': {
      margin: '0',
      fontSize: '16px',
      fontWeight: '400',
      color: '#333',
    },
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  saveButton: {
    display: 'flex',
    justifyContent: 'center',
    width: '160px',
    cursor: 'pointer',
    marign: 'auto',
    padding: '10px 20px',
    borderRadius: '5px',
    border: '1px solid blue',
  },
}));

const AccordionSummary = withStyles({
  root: {
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 40,
    '&$expanded': {
      minHeight: 40,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: '0px',
    },
  },
  expanded: {},
})(MuiAccordion);

interface ConversationBoardProps {
  currentPage: number;
  docsInPage: number;
  index: number;
  conversation: any;
  isUpdate: boolean;
  confirmOpen: boolean;
  conversationLastindex: number;
  onSaveCallback?: () => void;
  onEditConversation: (item: number) => void;
  deleteConfirm: () => void;
  setConfirmOpen: (open: boolean) => void;
  deleteConversationHandler: (convId: number) => void;
}
export const ConversationBoard = ({
  currentPage,
  docsInPage,
  index,
  conversation,
  isUpdate,
  conversationLastindex,
  confirmOpen,
  onEditConversation,
  onSaveCallback,
  deleteConfirm,
  setConfirmOpen,
  deleteConversationHandler,
}: ConversationBoardProps) => {
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

  const [isOpened, setOpen] = useState(false);
  const classes = useStyles();
  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);
  const [, setErrStatus] = useState('');  // errStatus

  const [actionData, setActionsValue] = useState<any | null>(
    isUpdate ? tempActionData : [],
  );
  const [turn, setTurns] = useState<string[]>(isUpdate ? userTurns : []);
  const [, setActionType] = useState<string>('UTTER');  // actionType
  const [, setLoding] = useState<boolean>(false); // loading

  const [createConversation] = useMutation(CREATE_TRAINING_CONVERSATION);
  const [updateConversation] = useMutation(UPDATE_TRAINING_CONVERSATION);

  const config = useRecoilValue(currentAgentConfig);

  const intents = config?.getIntents();
  const tagsData = config?.getTagTypes();
  const actions = config?.getActions();

  const intentOption = intents?.map((intent) => intent.name) || [];
  const tags: string[] = [];

  tagsData?.forEach((item) => tags.push(item));
  const actionId = actions?.map((item, ind) => item.name) || [];

  const handleOnSelect = (index: number, type: ACTION, value: any) => {
    const values = [...actionData];

    if (type === ACTION.USER_ACTION) {
      values[index].userActions[0].intent = value;
    } else if (type === ACTION.AGENT_ACTION) {
      values[index].agentActions[0].actionName = value;
    }

    setActionsValue([...values]);
    setErrStatus('');
  };

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

          const updatedUserActions = userActions.map((item) => {
            const result = omitDeep(item, '__typename');
            return result;
          });

          response = await updateConversation({
            variables: {
              conversationId: conversation?.id,
              conversation: {
                agentId,
                agentActions,
                userActions: updatedUserActions,
              },
            },
          });
        } else {
          response = await createConversation({
            variables: {
              conversation: {
                agentId,
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

  return (
    <Accordion className={classes.listItemWrapper} key={index} square={true}>
      <AccordionSummary
        id="conversationId"
        onClick={() => setOpen(!isOpened)}
        style={{ margin: '0px' }}>
        <Grid container={true} style={{ margin: '0px' }}>
          <Grid
            item={true}
            xs={11}
            sm={11}
            style={{ display: 'flex', flexFlow: 'horizontal' }}>
            {isOpened ? (
              <KeyboardArrowDown color="primary" style={{ fontSize: '30px' }} />
            ) : (
              <KeyboardArrowRight
                color="primary"
                style={{ fontSize: '30px' }}
              />
            )}
            <Typography className={classes.heading}>
              Conversation {conversationLastindex}
            </Typography>
          </Grid>
          <Grid item={true} container={true} xs={1} sm={1} justify="flex-end">
            <Grid className={classes.actionButtonWrapper}>
              <Delete fontSize="large" onClick={deleteConfirm} />
              <ConfirmDialog
                title="Delete Conversations?"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={() => deleteConversationHandler(conversation.id)}>
                Are you sure you want to delete this Conversations?
              </ConfirmDialog>
            </Grid>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails className={classes.listItem}>
        {/**/}
        <Grid // conversation panel
          container={true}
          direction={'column'}
          className={classes.paper}
        />
        <Grid container={true} direction={'column'} className={classes.paper}>
          {actionData?.map((inputField: any, index: number) => {
            const userAction: any = inputField.userActions
              ? inputField.userActions[0] || {}
              : {};
            const agentAction: any = inputField.agentActions
              ? inputField.agentActions[0] || {}
              : {};

            return (
              <Fragment key={`${inputField}-${index}`}>
                <Grid
                  container={true}
                  className={clsx(
                    classes.actionWrapper,
                    inputField.agentActions && classes.agentActionWrapper,
                  )}
                  key={index}>
                  <div/>
                  {turn[index] === 'user' || inputField.userActions ? (
                    <DialogueForm
                      index={index}
                      item={inputField}
                      type={ACTION.USER_ACTION}
                      options={intentOption}
                      value={userAction.intent}
                      onAutoFieldChange={handleOnSelect}
                      onTextFieldChange={handleOnChange}
                      onAddTags={handleAddTags}
                      onDelete={onDelete}
                    />
                  ) : (
                    <DialogueForm
                      index={index}
                      item={inputField}
                      type={ACTION.AGENT_ACTION}
                      options={actionId}
                      value={agentAction.actionName}
                      onAutoFieldChange={handleOnSelect}
                      onTextFieldChange={handleOnChange}
                      onDelete={onDelete}
                    />
                  )}
                </Grid>
              </Fragment>
            );
          })}
          <Grid container={true} className={classes.actionWrapper}>
            <Grid
              container={true}
              item={true}
              className={classes.UserActionsHeading}
              >
              <Typography style={{color: 'blue'}}> Add User Action </Typography>
              <IconButton onClick={() => handleAddFields('user')}>
                <AddCircleOutline fontSize="large"  style={{color: '#5867ca'}}/>
              </IconButton>
            </Grid>
            <Grid
              container={true}
              item={true}
              className={classes.AgentActionsHeading}
              justify="flex-end"
              >
              <Typography style={{color: 'blue'}}> Add Agent Action </Typography>
              <IconButton onClick={() => handleAddFields('agent')}>
                <AddCircleOutline fontSize="large" style={{color: '#5867ca'}}/>
              </IconButton>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="center">
            <div
              className={classes.saveButton}
              color="primary"
              onClick={onSubmit}>
              Save Conversation
            </div>
          </Box>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
