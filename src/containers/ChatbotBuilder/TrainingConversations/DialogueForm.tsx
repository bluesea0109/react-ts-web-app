import { DropDown } from '@bavard/react-components';
import {
  AccordionDetails,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/core/styles';
import { Delete } from '@material-ui/icons';
import React, { useState } from 'react';

import { KeyboardArrowDown, KeyboardArrowRight } from '@material-ui/icons';

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
  actionForm: {
    display: 'flex',
    flexFlow: 'vertical',
    padding: '10px 20px 20px',
  },
  textField: {
    width: '100%',
    float: 'right',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 0,
    fontWeight: 450,
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
  index: number;
  item: any;
  type: ACTION;
  options: string[];
  value: any;
  onAutoFieldChange: (index: number, type: ACTION, value: any) => void;
  onTextFieldChange: (index: number, event: any) => void;
  onAddTags?: (tagType: string, tagValue: string, index: number) => void;
  onDelete: (index: number, event: any) => void;
}

export const DialogueForm = ({
  index,
  item,
  type,
  options,
  value,
  onAutoFieldChange,
  onTextFieldChange,
  onAddTags,
  onDelete,
}: DialogueFormProps) => {
  const classes = useStyles();
  const [isOpened, setOpen] = useState(false);

  console.log('Item in DLG >>> ', item)

  const handleIntentField = (item: string) => {
    if (type === ACTION.USER_ACTION) {
      onAutoFieldChange(index, ACTION.USER_ACTION, item);
    } else {
      onAutoFieldChange(index, ACTION.AGENT_ACTION, item);
    }
  };

  const handleTagField = (item: string) => {
    onAutoFieldChange(index, ACTION.AGENT_ACTION, item);
  };
  return (
    <Accordion className={classes.listItemWrapper}>
      <AccordionSummary
        id="conversationId"
        onClick={() => setOpen(!isOpened)}
        style={{ margin: '0px' }}>
        {type === ACTION.USER_ACTION ? (
          <Grid item={true} className={classes.userActionHeader}>
            <Grid container={true}>
              {isOpened ? (
                <KeyboardArrowDown
                  color="primary"
                  style={{ fontSize: '30px', color: 'white' }}
                />
              ) : (
                <KeyboardArrowRight
                  color="primary"
                  style={{ fontSize: '30px', color: 'white' }}
                />
              )}
              <Typography className={classes.heading}>User Action</Typography>
            </Grid>
            <Grid container={true} justify="flex-end">
              <Typography className={classes.heading}>{value}</Typography>
              <IconButton
                onClick={(event) => onDelete(index, event)}
                style={{ float: 'right', color: 'white', padding: '10px' }}>
                <Delete fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        ) : (
          <Grid item={true} className={classes.agentActionHeader}>
            <Grid container={true}>
              {isOpened ? (
                <KeyboardArrowDown
                  color="primary"
                  style={{ fontSize: '30px', color: 'white' }}
                />
              ) : (
                <KeyboardArrowRight
                  color="primary"
                  style={{ fontSize: '30px', color: 'white' }}
                />
              )}
              <Typography className={classes.heading}>Agent Action</Typography>
            </Grid>
            <Grid container={true} justify="flex-end">
              <Typography className={classes.heading}>{value}</Typography>
              <IconButton
                onClick={(event) => onDelete(index, event)}
                style={{ color: 'white' }}>
                <Delete fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        )}
      </AccordionSummary>
      <AccordionDetails className={classes.listItem}>
        <Grid container={true} className={classes.actionForm}>
          <Grid container={true}>
            <Grid item={true} xs={4}>
              <Typography>
                {type === ACTION.USER_ACTION ? 'Intent' : 'Action Name'}
              </Typography>
              <DropDown
                labelPosition="top"
                current={value}
                menuItems={options}
                onChange={handleIntentField}
              />
            </Grid>
            <Grid item={true} xs={1} />
            <Grid item={true} xs={7}>
              <Typography>Intent</Typography>
              <TextField
                variant="outlined"
                size="small"
                className={classes.textField}
              />
            </Grid>
          </Grid>
        </Grid>
        {type === ACTION.USER_ACTION && (
          <>
            <Grid container={true} className={classes.actionForm}>
              <Grid container={true}>
                <Grid item={true} xs={4}>
                  <Typography>User Action</Typography>
                  <DropDown
                    labelPosition="top"
                    current={value}
                    menuItems={options}
                    onChange={handleTagField}
                  />
                </Grid>
                <Grid item={true} xs={1} />
                <Grid item={true} xs={7}>
                  <Typography>Intent</Typography>
                  <TextField
                    variant="outlined"
                    size="small"
                    className={classes.textField}
                  />
                </Grid>
              </Grid>
            </Grid>            
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
