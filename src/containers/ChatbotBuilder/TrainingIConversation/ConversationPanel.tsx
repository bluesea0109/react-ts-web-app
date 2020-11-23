import React, { useEffect, useState } from 'react';
import {
  Grid,
  makeStyles,
  Typography,
  Box,
  IconButton,
} from '@material-ui/core';
import {
  EDialogueActor,
  IConversation,
  IUserDialogueTurn,
  IAgentDialogueTurn,
} from '@bavard/agent-config/dist/conversations';
import { useRecoilState } from 'recoil';
import { trainingConversation } from '../atoms';
import ActionPanel from './ActionPanel';
import { AddCircleOutline, Delete } from '@material-ui/icons';
import { EUserActionType } from '@bavard/agent-config/dist/actions/user';
import _ from 'lodash';
import { EAgentActionTypes } from '@bavard/agent-config/dist/enums';
import { ACTION_TYPE } from './type';

interface ReceiveProps {
  agentId: number;
  id: number;
  conversation: IConversation;
  metadata: object;
}

interface ConversationPanelProps {
  conversation: ReceiveProps;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: '20px',
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
    marginBottom: '30px',
  },
  actionWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'unset',
    flexDirection: 'row',
    padding: '30px',
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
  userAction: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '30px',
  },
  agentAction: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '30px',
  },
  arrow: {
    color: 'blue',
    fontSize: '30px',
  },
}));

const ConversationPanel = ({ conversation }: ConversationPanelProps) => {
  const classes = useStyles();
  const [data, updateData] = useRecoilState(trainingConversation);

  useEffect(() => {
    updateData(conversation.conversation);
  }, [conversation.conversation, updateData]);

  const renderActions = () => {
    return (
      <Grid>
        {data?.turns.map((action: any, index) => {
          return action.actor === 'USER' ? (
            <Grid className={classes.userAction}>
              <ActionPanel
                action={action.userAction}
                type={ACTION_TYPE.USER_ACTION}
                order={index}
                onDelete={handleDelete}
              />
            </Grid>
          ) : (
            <Grid className={classes.agentAction}>
              <ActionPanel
                action={action.agentAction}
                type={ACTION_TYPE.AGENT_ACTION}
                order={index}
                onDelete={handleDelete}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const handleAddFields = (param: ACTION_TYPE) => {
    if (param === ACTION_TYPE.USER_ACTION) {
      const userActionData: IUserDialogueTurn = {
        actor: EDialogueActor.USER,
        userAction: {
          type: EUserActionType.UTTERANCE_ACTION,
          utterance: '',
          intent: '',
          tags: [],
        },
        timestamp: new Date().getTime(),
      };
      const updatedData = _.cloneDeep(data);
      const another = {
        ...updatedData,
        turns: [...(updatedData as IConversation).turns, userActionData],
      };
      updateData(another as IConversation);
    } else {
      const agentActionData: IAgentDialogueTurn = {
        actor: EDialogueActor.AGENT,
        agentAction: {
          type: EAgentActionTypes.UTTERANCE_ACTION,
          utterance: '',
          name: '',
          options: [],
        },
        timestamp: new Date().getTime(),
      };

      const updatedData = _.cloneDeep(data);
      const another = {
        ...updatedData,
        turns: [...(updatedData as IConversation).turns, agentActionData],
      };
      updateData(another as IConversation);
    }
  };

  const handleDelete = (param: number) => {
    const tempData = _.cloneDeep(data);
    const deletedData = {
      ...tempData,
      turns: (tempData as IConversation).turns.filter(
        (item, index) => index !== param,
      ),
    };
    updateData(deletedData as IConversation);
  };
  const onSubmit = () => {};
  return (
    <Grid>
      <Grid container={true} direction={'column'} className={classes.paper}>
        {renderActions()}
      </Grid>
      <Grid container={true} className={classes.actionWrapper}>
        <Grid
          container={true}
          item={true}
          className={classes.UserActionsHeading}>
          <Typography style={{ color: 'blue' }}> Add User Action </Typography>
          <IconButton onClick={() => handleAddFields(ACTION_TYPE.USER_ACTION)}>
            <AddCircleOutline fontSize="large" style={{ color: '#5867ca' }} />
          </IconButton>
        </Grid>
        <Grid
          container={true}
          item={true}
          className={classes.AgentActionsHeading}
          justify="flex-end">
          <Typography style={{ color: 'blue' }}> Add Agent Action </Typography>
          <IconButton onClick={() => handleAddFields(ACTION_TYPE.AGENT_ACTION)}>
            <AddCircleOutline fontSize="large" style={{ color: '#5867ca' }} />
          </IconButton>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="center">
        <div className={classes.saveButton} color="primary" onClick={onSubmit}>
          Save Conversation
        </div>
      </Box>
    </Grid>
  );
};
export default ConversationPanel;
