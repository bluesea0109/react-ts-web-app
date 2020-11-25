import React, { useEffect } from 'react';
import clsx from 'clsx';
import { BasicButton, IconButton } from '@bavard/react-components';
import { Grid, makeStyles, Box } from '@material-ui/core';
import {
  EDialogueActor,
  IConversation,
  IUserDialogueTurn,
  IAgentDialogueTurn,
} from '@bavard/agent-config/dist/conversations';
import { useRecoilState } from 'recoil';
import { trainingConversation } from '../atoms';
import ActionPanel from './ActionPanel';
import { AddCircleOutline } from '@material-ui/icons';
import { EUserActionType } from '@bavard/agent-config/dist/actions/user';
import _ from 'lodash';
import { EAgentActionTypes } from '@bavard/agent-config/dist/enums';
import { ACTION_TYPE, IUtternaceAction } from './type';
import { ITrainingConversation } from '../../../models/chatbot-service';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: '20px',
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
}));

const ConversationPanel = ({
  conversation,
}: {
  conversation: ITrainingConversation;
}) => {
  const classes = useStyles();
  const [data, updateData] = useRecoilState(trainingConversation);

  useEffect(() => {
    updateData(conversation.conversation);
  }, [conversation.conversation, updateData]);

  const handleAddField = (param: ACTION_TYPE) => {
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

  const handleDelete = (index: number) => {
    const oldConversation = _.cloneDeep(data);
    updateData({
      ...oldConversation,
      turns: (oldConversation as IConversation).turns.filter(
        (_, i) => i !== index,
      ),
    } as IConversation);
  };

  const handleUpdateAction = (action: IUtternaceAction, index: number) => {
    const oldConversation = _.cloneDeep(data);
    const newConversation = {
      ...oldConversation,
      turns: (oldConversation as IConversation).turns.filter(
        (conversation, i) => (i !== index ? conversation : action),
      ),
    } as IConversation;
    updateData(newConversation);
  };

  const onSubmit = () => {};

  return (
    <Grid>
      <Grid container={true} direction={'column'} className={classes.paper}>
        {data?.turns.map((action: any, index) => {
          const isUserAction = action.actor === 'USER';
          return (
            <Grid
              key={index}
              className={clsx({
                [classes.userAction]: isUserAction,
                [classes.agentAction]: !isUserAction,
              })}>
              <ActionPanel
                action={isUserAction ? action.userAction : action.agentAction}
                type={
                  isUserAction
                    ? ACTION_TYPE.USER_ACTION
                    : ACTION_TYPE.AGENT_ACTION
                }
                updateAction={(action) => handleUpdateAction(action, index)}
                onDelete={() => handleDelete(index)}
              />
            </Grid>
          );
        })}
      </Grid>
      <Box display="flex" justifyContent="space-between" px={5}>
        <IconButton
          variant="text"
          title="Add User Action"
          iconPosition="right"
          Icon={AddCircleOutline}
          onClick={() => handleAddField(ACTION_TYPE.USER_ACTION)}
        />
        <IconButton
          variant="text"
          title="Add Agent Action"
          iconPosition="right"
          Icon={AddCircleOutline}
          onClick={() => handleAddField(ACTION_TYPE.AGENT_ACTION)}
        />
      </Box>
      <Box display="flex" justifyContent="center" mb={2}>
        <BasicButton
          variant="outlined"
          title="Save Conversation"
          onClick={onSubmit}
        />
      </Box>
    </Grid>
  );
};
export default ConversationPanel;
