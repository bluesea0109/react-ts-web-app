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
import React, { useState } from 'react';
import { ConfirmDialog } from '../../../components';

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
    padding: '10px 0',
  },
  agentActionWrapper: {
    justifyContent: 'space-between',
    margin: '12px 0 10px',
  },
  actionsWrapper: {
    border: '1px solid #000',
    borderRadius: '3px',
    width: 'calc(50% + 150px)',
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
  item: any;
  confirmOpen: boolean;
  onEditConversation: (item: number) => void;
  deleteConfirm: () => void;
  setConfirmOpen: (open: boolean) => void;
  deleteConversationHandler: (convId: number) => void;
}
export const ConversationBoard = ({
  currentPage,
  docsInPage,
  index,
  item,
  confirmOpen,
  onEditConversation,
  deleteConfirm,
  setConfirmOpen,
  deleteConversationHandler,
}: ConversationBoardProps) => {
  const [isOpened, setOpen] = useState(false);
  const classes = useStyles();
  return (
    <Accordion className={classes.listItemWrapper} key={index} square={true}>
      <AccordionSummary id="conversationId" onClick={() => setOpen(!isOpened)} style={{margin: '0px'}}>
        <Grid container={true}  style={{margin: '0px'}}>
          <Grid item={true} xs={11} sm={11} style={{display: 'flex', flexFlow: 'horizontal'}}>
            {isOpened ? (
              <KeyboardArrowDown color="primary" style={{ fontSize: '30px' }} />
            ) : (
              <KeyboardArrowRight
                color="primary"
                style={{ fontSize: '30px' }}
              />
            )}
            <Typography className={classes.heading}>
              Conversation {(currentPage - 1) * docsInPage + index + 1}
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
          className={classes.paper}/>
        <Grid container={true} direction={'column'} className={classes.paper}>
          {item.actions.map((item: any, index: number) => {
            return (
              <Grid
                container={true}
                className={clsx(
                  classes.actionWrapper,
                  item.isAgent && classes.agentActionWrapper,
                )}
                key={index}>
                <Grid
                  container={true}
                  item={true}
                  className={classes.actionItemWrapper}>
                  <Typography> {item.turn} </Typography>
                </Grid>
                {item.isUser ? (
                  <Grid
                    container={true}
                    item={true}
                    className={classes.actionsWrapper}>
                    <span className={classes.agentTagText}>User Action</span>
                    <Grid
                      container={true}
                      className={classes.actionDetailsWrapper}
                      direction={'column'}>
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
                        <Paper
                          component="ul"
                          className={classes.tagListWrapper}>
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
                    </Grid>
                  </Grid>
                ) : (
                  <Grid
                    container={true}
                    item={true}
                    className={classes.actionsWrapper}>
                    <span className={classes.agentTagText}>Agent Action</span>
                    <Grid
                      container={true}
                      className={classes.actionDetailsWrapper}
                      direction={'column'}>
                      <Grid className={classes.contentTable}>
                        <span className={classes.itemWrapper}>
                          <h6>Action Type:</h6>
                          <p>{item.actionName}</p>
                        </span>
                        <span className={classes.itemWrapper}>
                          <h6>Utterance:</h6>
                          <p>{item.utterance}</p>
                        </span>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            );
          })}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
