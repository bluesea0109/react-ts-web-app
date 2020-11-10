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
import React, { useState } from 'react';
import { Action } from 'redux';

import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  KeyboardArrowUp,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
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
  userActionHeader: {
    display: 'flex',
    backgroundColor: '#127D78',
    width: '40vw',
    height: '50px',
    color: 'white',
    padding: '10px',
  },
  agentActionHeader: {
    display: 'flex',
    backgroundColor: '#0200E6',
    width: '40vw',
    height: '50px',
    color: 'white',
    padding: '10px',
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

export enum ACTION {
  USER_ACTION = 'user_action',
  AGENT_ACTION = 'agent_action',
}

interface DialogueFormProps {
  item: any;
  type: ACTION;
}

export const DialogueForm = ({ item, type }: DialogueFormProps) => {
  const classes = useStyles();
  const [isOpened, setOpen] = useState(false);
  return (
    <Accordion className={classes.listItemWrapper}>
      <AccordionSummary
        id="conversationId"
        onClick={() => setOpen(!isOpened)}
        style={{ margin: '0px' }}>
        {type === ACTION.USER_ACTION ? (
          <Grid
            item={true}
            className={classes.userActionHeader}>
            {isOpened ? (
              <KeyboardArrowDown color="primary" style={{ fontSize: '30px', color: 'white' }} />
            ) : (
              <KeyboardArrowRight
                color="primary"
                style={{ fontSize: '30px', color: 'white' }}
              />
            )}
            <Typography className={classes.heading}>
              User Action
            </Typography>
          </Grid>
        ) : (
          <Grid
            item={true}
            className={classes.agentActionHeader}>
            {isOpened ? (
              <KeyboardArrowDown color="primary" style={{ fontSize: '30px', color: 'white' }} />
            ) : (
              <KeyboardArrowRight
                color="primary"
                style={{ fontSize: '30px', color: 'white' }}
              />
            )}
            <Typography className={classes.heading}>
              Agent Action
            </Typography>
          </Grid>
        )}
      </AccordionSummary>
      <AccordionDetails className={classes.listItem}>
        <Grid className={classes.contentTable}>
          <span className={classes.itemWrapper}>
            <h6>Intent:</h6>
            <p>{item.intent}</p>
          </span>
          <span className={classes.itemWrapper}>
            <h6>Utterance:</h6>
            <p>{item.utterance}</p>
          </span>
        </Grid>
        <Grid container={true} className={classes.tagList}>
          <span className={classes.agentTagText}>Tags</span>
          <Paper component="ul" className={classes.tagListWrapper}>
            {item.tagValues?.map((item: any, i: number) => {
              const label = item.tagType + ' : ' + item.value;
              return (
                <li key={i}>
                  <Chip label={label} className={classes.chip} />
                </li>
              );
            })}
          </Paper>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
