import {
  makeStyles,
  AccordionDetails,
  Theme,
  Accordion,
  Box,
  Typography,
  Grid,
} from '@material-ui/core';
import React, { useState } from 'react';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/core/styles';
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  Delete,
  AddCircleOutline,
} from '@material-ui/icons';
import { IUserUtteranceAction } from '@bavard/agent-config/dist/actions/user';
import { ITagValue } from '@bavard/agent-config';
import { IconButton } from '@bavard/react-components';
import { FIELD_TYPE, IUtternaceAction, Field } from './type';
import { GroupField } from './GroupField';

import { useRecoilValue } from 'recoil';
import { currentAgentConfig } from '../atoms';
import {
  EDialogueActor,
  IDialogueTurn,
} from '@bavard/agent-config/dist/conversations';

const useStyle = makeStyles((theme: Theme) => ({
  listItemWrapper: {
    width: '80%',
    border: '1px solid rgba(0,0,0,0.2)',
    boxShadow: 'none',
    marginBottom: theme.spacing(4),
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
  expanded: {},
})(MuiAccordionSummary);

interface ActionPanelProps {
  action: IUtternaceAction;
  actor: EDialogueActor;
  onDelete: () => void;
  onUpdate: (action: IDialogueTurn) => void;
}

export enum CHANGE_FIELD {
  UTTERANCE = 'utterance',
  INTENT = 'INTENT',
  ACTION_NAME = 'ACTION_NAME',
}

const ActionPanel = ({
  action,
  actor,
  onUpdate: handleUpdate,
  onDelete,
}: ActionPanelProps) => {
  const config = useRecoilValue(currentAgentConfig);

  const classes = useStyle();
  const [isOpened, setOpen] = useState(false);
  const intentList = config?.getIntents();
  const tagList = config?.getTagTypes();

  const isUserAction = actor === EDialogueActor.USER;

  const onAddTag = () => {
    handleUpdate({
      actor,
      userAction: {
        ...action,
        tags: [
          ...((action as IUserUtteranceAction)?.tags || []),
          {
            tagType: '',
            value: '',
          } as ITagValue,
        ],
      } as IUserUtteranceAction,
    } as IDialogueTurn);
  };
  const onUpdateIntent = (field: Field) => {};

  const onUpdateTag = (field: Field, index: number) => {};

  const intents = (intentList || []).map((item) => item.name);

  return (
    <Accordion className={classes.listItemWrapper} square={true}>
      <AccordionSummary id="conversationId" onClick={() => setOpen(!isOpened)}>
        <Grid
          className={
            isUserAction ? classes.userActionHeader : classes.agentActionHeader
          }>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width={1}>
            <Box display="flex" flexDirection="row">
              {isOpened ? (
                <KeyboardArrowDown color="primary" className={classes.arrow} />
              ) : (
                <KeyboardArrowRight color="primary" className={classes.arrow} />
              )}
              <Typography className={classes.heading}>
                {isUserAction ? 'User Action' : 'Agent Action'}
              </Typography>
            </Box>
            <Box>
              <Delete onClick={onDelete} />
            </Box>
          </Box>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Box width={1}>
          {isUserAction ? (
            <>
              <GroupField
                field={{
                  name: (action as IUserUtteranceAction).intent || '',
                  value: (action as IUserUtteranceAction).utterance || '',
                }}
                fieldType={FIELD_TYPE.INTENT}
                options={intents}
                onUpdate={onUpdateIntent}
              />
              {(action as IUserUtteranceAction)?.tags?.map((item, index) => (
                <GroupField
                  key={index}
                  field={{
                    name: item.tagType,
                    value: item.value,
                  }}
                  options={Array.from(tagList || [])}
                  fieldType={FIELD_TYPE.TAG}
                  onUpdate={(field: Field) => onUpdateTag(field, index)}
                />
              ))}
              <Box width={1} display="flex" justifyContent="flex-end">
                <IconButton
                  variant="text"
                  title="Add Tag"
                  iconPosition="right"
                  Icon={AddCircleOutline}
                  onClick={onAddTag}
                />
              </Box>
            </>
          ) : (
            <GroupField
              fieldType={FIELD_TYPE.INTENT}
              field={{
                name: (action as any).intent,
                value: action.utterance,
              }}
              options={intents}
              onUpdate={onUpdateIntent}
            />
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ActionPanel;
