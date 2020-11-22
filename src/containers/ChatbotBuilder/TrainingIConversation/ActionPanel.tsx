import { makeStyles, AccordionDetails, IconButton } from '@material-ui/core';
import React, { useState } from 'react';
import { Accordion, Box, Typography, Grid } from '@material-ui/core';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/core/styles';
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  Delete,
  AddCircleOutline,
} from '@material-ui/icons';
import {
  EUserActionType,
  IUserAction,
  IUserUtteranceAction,
} from '@bavard/agent-config/dist/actions/user';
import { IConversation } from '@bavard/agent-config/dist/conversations/'
import { IAgentUtteranceAction } from '@bavard/agent-config';
import { ACTION_TYPE, FIELD_TYPE } from './type';
import { GroupField } from './GroupField';

import { config } from 'process';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentAgentConfig, trainingConversation } from '../atoms';
import _ from 'lodash';
import {
  EDialogueActor,
  IUserDialogueTurn,
} from '@bavard/agent-config/dist/conversations';
import userEvent from '@testing-library/user-event';

const useStyle = makeStyles((theme) => ({
  listItemWrapper: {
    width: '800px',
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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    paddingTop: '5px',
  },
  userActionHeader: {
    display: 'flex',
    backgroundColor: '#127D78',
    width: '100%',
    height: '40px',
    color: 'white',
    padding: '10px',
  },
  agentActionHeader: {
    display: 'flex',
    backgroundColor: '#0200E6',
    width: '100%',
    color: 'white',
    padding: '10px',
  },
  arrow: {
    color: 'white',
    fontSize: '30px',
  },
  AgentActionsHeading: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '50%',
  },
}));

const AccordionSummary = withStyles({
  root: {
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 50,
    padding: 0,
    margin: 0,
    '&$expanded': {
      minHeight: 30,
    },
  },
  content: {
    margin: 0,
    '&$expanded': {
      margin: '0',
    },
  },
  AgentActionsHeading: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '50%',
  },
  expanded: {},
})(MuiAccordionSummary);

interface ActionPanelProps {
  action: IUserUtteranceAction | IAgentUtteranceAction;
  type: ACTION_TYPE;
  order: number;
  onDelete: (index: number) => void;
}

export enum CHANGE_FIELD {
  UTTERANCE = 'utterance',
  INTENT = 'INTENT',
  ACTION_NAME = 'ACTION_NAME',
}

const ActionPanel = ({ action, type, order, onDelete }: ActionPanelProps) => {
  const config = useRecoilValue(currentAgentConfig);

  const classes = useStyle();
  const [isOpened, setOpen] = useState(false);
  const intentList = config?.getIntents();
  const tagList = config?.getTagTypes();
  const intents: string[] = [];
  const tags: string[] = [];

  const [data, updateData] = useRecoilState(trainingConversation);

  console.log('***data in action panel', data);

  const handleAddTag = () => {
    const updatedData = _.cloneDeep(data);
    const another = {
      ...updatedData,
      turns: [...(updatedData as IConversation).turns, ((updatedData?.turns[order] as IUserDialogueTurn)
        ?.userAction as IUserUtteranceAction)?.tags?.push({
        tagType: '',
        value: '',
      })],
    };
    updateData(another as IConversation)
  };
  tagList?.forEach((item) => tags.push(item));
  intentList?.forEach((item) => intents.push(item.name));
  type === ACTION_TYPE.USER_ACTION;

  return (
    <Accordion className={classes.listItemWrapper} square={true}>
      <AccordionSummary
        id="conversationId"
        onClick={() => setOpen(!isOpened)}
        style={{ margin: '0px' }}>
        <Grid
          className={
            type === ACTION_TYPE.USER_ACTION
              ? classes.userActionHeader
              : classes.agentActionHeader
          }>
          <Box display="flex" justifyContent="space-between" width={1}>
            <Box display="flex" flexDirection="row">
              {isOpened ? (
                <KeyboardArrowDown color="primary" className={classes.arrow} />
              ) : (
                <KeyboardArrowRight color="primary" className={classes.arrow} />
              )}
              <Typography className={classes.heading}>Conversation</Typography>
            </Box>
            <Box>
              <Delete fontSize="large" onClick={() => onDelete(order)} />
            </Box>
          </Box>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Box justifyContent="column" style={{ width: '100%' }}>
          {type === ACTION_TYPE.USER_ACTION ? (
            <>
              <GroupField
                type={ACTION_TYPE.USER_ACTION}
                field={FIELD_TYPE.INTENT}
                data={(action as IUserUtteranceAction).intent}
                option={intents}
                order={order}
              />
              {(action as IUserUtteranceAction)?.tags?.length &&
                (action as IUserUtteranceAction)?.tags?.map((item, index) => (
                  <GroupField
                    data={item.value}
                    type={ACTION_TYPE.USER_ACTION}
                    field={FIELD_TYPE.TAG}
                    key={index}
                    option={tags}
                    order={order}
                  />
                ))}
              <Grid
                container={true}
                item={true}
                className={classes.AgentActionsHeading}
                justify="flex-end">
                <Typography style={{ color: 'blue' }}>
                  {' '}
                  Add Agent Action{' '}
                </Typography>
                <IconButton onClick={() => handleAddTag}>
                  <AddCircleOutline
                    fontSize="large"
                    style={{ color: '#5867ca' }}
                  />
                </IconButton>
              </Grid>
            </>
          ) : (
            <>
              <GroupField
                data={action.utterance}
                type={ACTION_TYPE.AGENT_ACTION}
                field={FIELD_TYPE.NAME}
                option={intents}
                order={order}
              />
            </>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ActionPanel;
