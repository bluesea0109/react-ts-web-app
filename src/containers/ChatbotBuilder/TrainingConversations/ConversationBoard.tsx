import { useMutation } from '@apollo/client';
import {
  AccordionDetails,
  Chip,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/core/styles';
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  KeyboardArrowUp,
} from '@material-ui/icons';
import { Delete, Edit } from '@material-ui/icons';
import clsx from 'clsx';
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
  actionDetailsWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  agentActionWrapper: {
    justifyContent: 'space-between',
    margin: '12px 0 10px',
  },
  actionsWrapper: {
    border: '1px solid #ccc',
    borderRadius: '3px',
    width: 'calc(50% + 150px)',
    color: 'white',
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
  contentTable: {
    width: '100%',
    display: 'flex',
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
  userActionHeader: {
    display: 'flex',
    backgroundColor: '#127D78',
    width: '100%',
    height: '50px',
  },
  agentActionHeader: {
    display: 'flex',
    backgroundColor: '#0200E6',
    width: '100%',
    height: '50px',
  },
  tagList: {
    marginTop: '17px',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'unset',
    position: 'relative',
  },
  tagListWrapper: {
    display: 'flex',
    overflowX: 'auto',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: '0 13px 0 5px',
    flex: '1',
    background: 'transparent',
    border: '1px solid #000',
    borderRadius: '3px',
    height: '40px',
    '&::-webkit-scrollbar': {
      width: '0.4em',
      height: '3px',
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey',
    },
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  expansionIcon: {
    position: 'relative',
    left: '0px',
    backgroundColor: 'green',
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
            <Delete />
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails className={classes.listItem}>
        {/*<Grid className={classes.actionButtonWrapper}>
          <IconButton onClick={() => onEditConversation(item.id)}>
            <Edit fontSize="large" />
          </IconButton>
          <IconButton onClick={deleteConfirm}>
            <Delete fontSize="large" />
          </IconButton>
          <ConfirmDialog
            title="Delete Conversations?"
            open={confirmOpen}
            setOpen={setConfirmOpen}
            onConfirm={() => deleteConversationHandler(item.id)}>
            Are you sure you want to delete this Conversations?
          </ConfirmDialog>
        </Grid>*/}
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
                  <Grid
                    container={true}
                    item={true}
                    className={classes.actionItemWrapper}>
                    <Typography> {index} </Typography>
                  </Grid>
                  {turn[index] === 'user' || inputField.userActions ? (
                    <DialogueForm
                      index={index}
                      item={inputField}
                      type={ACTION.USER_ACTION}
                      options={intentOption}
                      value={userAction}
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
                      options={intentOption}
                      value={agentAction}
                      onAutoFieldChange={handleOnSelect}
                      onTextFieldChange={handleOnChange}
                      onDelete={onDelete}
                    />
                  )}
                </Grid>
              </Fragment>
            );
          })}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
