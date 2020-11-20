import React, { useEffect, useState } from 'react';
import {
  Accordion,
  Grid,
  makeStyles,
  Typography,
  Box,
  AccordionDetails,
} from '@material-ui/core';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { KeyboardArrowDown, KeyboardArrowRight } from '@material-ui/icons';
import { Delete } from '@material-ui/icons';
import { IConversation } from '@bavard/agent-config/dist/conversations';
import { useRecoilState } from 'recoil';
import { trainingConversation } from '../atoms';
import ActionPanel from './ActionPanel';
import { withStyles } from '@material-ui/core/styles';

interface ReceiveProps {
  agentId: number;
  id: number;
  conversation: IConversation;
  metadata: object;
}

interface ConversationPanelProps {
  conversation: ReceiveProps;
}

export enum ACTION_TYPE {
  USER_ACTION = 'user_action',
  AGENT_ACTION = 'agent_action',
}

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: '20px',
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
    fontSize: '30px'
  }
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

const ConversationPanel = ({ conversation }: ConversationPanelProps) => {
  const classes = useStyles();
  const [isOpened, setOpen] = useState(false);
  console.log('Conversation >>>> ', conversation)
  const renderActions = () => {
    return (
      <Grid>
        {conversation?.conversation.turns.map((action: any, id) => {
          return action.actor === 'USER' ? (
            <Grid className={classes.userAction}>
              <ActionPanel
                action={action.userAction}
                type={ACTION_TYPE.USER_ACTION}
              />
            </Grid>
          ) : (
            <Grid className={classes.agentAction}>
              <ActionPanel
                action={action.agentAction}
                type={ACTION_TYPE.AGENT_ACTION}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Grid>
      {/* <Accordion className={classes.listItemWrapper} square={true}> */}
        {/* <AccordionSummary
          id="conversationId"
          onClick={() => setOpen(!isOpened)}          
          >
          <Box display="flex" justifyContent="space-between" width={1}>
            <Box display="flex" flexDirection="row">
              {isOpened ? (
                <KeyboardArrowDown
                  color="primary"
                  className={classes.arrow}
                />
              ) : (
                <KeyboardArrowRight
                  color="primary"
                  style={{ fontSize: '30px' }}
                  className={classes.arrow}
                />
              )}
              <Typography className={classes.heading}>Conversation</Typography>
            </Box>
            <Box>
              <Delete fontSize="large" onClick={() => console.log('okay')} />
            </Box>
          </Box>
        </AccordionSummary> */}
        {/* <AccordionDetails className={classes.listItem}> */}
          <Grid container={true} direction={'column'} className={classes.paper}>
            {renderActions()}
          </Grid>
        {/* </AccordionDetails>
      </Accordion> */}
    </Grid>
  );
};

export default ConversationPanel;
