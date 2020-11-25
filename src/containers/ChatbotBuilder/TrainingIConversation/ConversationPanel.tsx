import { useMutation } from '@apollo/client';
import { BasicButton, IconButton } from '@bavard/react-components';
import { EUserActionType } from '@bavard/agent-config/dist/actions/user';
import { EAgentActionTypes } from '@bavard/agent-config/dist/enums';
import {
  EDialogueActor,
  IConversation,
  IUserDialogueTurn,
  IAgentDialogueTurn,
  IDialogueTurn,
} from '@bavard/agent-config/dist/conversations';
import { AddCircleOutline } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Grid, makeStyles, Box } from '@material-ui/core';
import { useRecoilState } from 'recoil';
import { useSnackbar } from 'notistack';
import _ from 'lodash';

import ActionPanel from './ActionPanel';
import { trainingConversation } from '../atoms';
import { ACTION_TYPE, IUtternaceAction } from './type';
import { ITrainingConversation } from '../../../models/chatbot-service';
import {
  UPDATE_TRAINING_CONVERSATION,
  GET_TRAINING_CONVERSATIONS,
} from '../../../common-gql-queries';

const useStyles = makeStyles({
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
});

const ConversationPanel = ({
  conversation,
}: {
  conversation: ITrainingConversation;
}) => {
  const classes = useStyles();
  const params = useParams<{ agentId: string }>();
  const [data, updateData] = useRecoilState(trainingConversation);
  const { enqueueSnackbar } = useSnackbar();

  const [updateConversation, { loading, error }] = useMutation(
    UPDATE_TRAINING_CONVERSATION,
    {
      refetchQueries: [
        {
          query: GET_TRAINING_CONVERSATIONS,
          variables: { agentId: Number(params.agentId) },
        },
      ],
      awaitRefetchQueries: true,
      onError: (error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      },
      onCompleted: () => {
        enqueueSnackbar('Conversation Successfully Updated!', {
          variant: 'success',
        });
      },
    },
  );

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

  const handleDeleteTurn = (index: number) => {
    const oldConversation = _.cloneDeep(data);
    updateData({
      ...oldConversation,
      turns: (oldConversation as IConversation).turns.filter(
        (_, i) => i !== index,
      ),
    } as IConversation);
  };

  const handleUpdateTurn = (turn: IDialogueTurn, index: number) => {
    const oldConversation = _.cloneDeep(data);
    const newConversation = {
      ...oldConversation,
      turns: (oldConversation as IConversation).turns.map((each, i) =>
        i !== index ? each : turn,
      ),
    } as IConversation;
    updateData(newConversation);
  };

  const onSubmit = () => {
    updateConversation({
      variables: {
        id: conversation.id,
        conversation: data,
      },
    });
  };

  return (
    <Grid>
      <Grid container={true} direction={'column'} className={classes.paper}>
        {data?.turns.map((turn: IDialogueTurn, index) => {
          const isUserAction = turn.actor === EDialogueActor.USER;
          return (
            <Grid
              key={index}
              className={clsx({
                [classes.userAction]: isUserAction,
                [classes.agentAction]: !isUserAction,
              })}>
              <ActionPanel
                action={
                  // prettier-ignore
                  (isUserAction
                    ? (turn as IUserDialogueTurn).userAction
                    : (turn as IAgentDialogueTurn).agentAction
                  ) as IUtternaceAction
                }
                actor={turn.actor}
                onUpdate={(turn) => handleUpdateTurn(turn, index)}
                onDelete={() => handleDeleteTurn(index)}
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
