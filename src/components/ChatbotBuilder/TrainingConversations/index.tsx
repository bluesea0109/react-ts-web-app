import { useMutation, useQuery } from '@apollo/client';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip, Grid,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import { Delete, Edit, ExpandMore } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  DELETE_TRAINING_CONVERSATION,
  GET_TRAINING_CONVERSATIONS,
} from '../../../common-gql-queries';
import { ITrainingConversations } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import ConfirmDialog from '../../Utils/ConfirmDialog';
import CreateConversation from './NewTrainingConversations';

interface IGetTrainingConversation {
  ChatbotService_trainingConversations: ITrainingConversations[];
}

export default function TrainingConversations() {
  const classes = useStyles();
  const { agentId } = useParams();
  const [createConversation, setcreateConversation] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editConversation, seteditConversation] = useState(0);
  const numAgentId = Number(agentId);

  const [deleteConversations, { loading }] = useMutation(DELETE_TRAINING_CONVERSATION);
  const getTrainingConversations = useQuery<IGetTrainingConversation>(GET_TRAINING_CONVERSATIONS, { variables: { agentId: numAgentId } });
  let conversations = getTrainingConversations.data?.ChatbotService_trainingConversations || [];

  console.log('conversations ', conversations);
  const refetchConversations = getTrainingConversations.refetch;
  const data = conversations.map((item: any) => {
    const userActions = item.userActions.map((a: any) => ({ ...a, isUser: true }));
    const agentActions = item.agentActions.map((a: any) => ({...a, isAgent: true}));
    const arr = userActions.concat(agentActions).sort((a: any, b: any) => parseFloat(a.turn) - parseFloat(b.turn));
    return { actions: arr, id: item.id };
  });

  if (getTrainingConversations.error) {
    return <ApolloErrorPage error={getTrainingConversations.error} />;
  }

  if (getTrainingConversations.loading) {
    return <ContentLoading />;
  }
  const onCreateNewConversation = () => {
    setcreateConversation(true);
  };

  const onSaveCallBack = async () => {
    const refetchData = await refetchConversations();
    conversations = refetchData.data?.ChatbotService_trainingConversations || [];
    setcreateConversation(false);
    seteditConversation(0);
  };

  const onEditConversation = (index: number) => {
    seteditConversation(index);
  };

  const deleteConversationHandler = async (conversationId: number) => {
    const response = await deleteConversations({
      variables: {
        conversationId,
      },
    });
    if (response) {
      onSaveCallBack();
    }
  };

  const deleteConfirm = () => setConfirmOpen(true);
  const onCancel = () => seteditConversation(0);

  return (
    <Paper className={classes.paper}>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={onCreateNewConversation}
      >
        Create New Conversation
      </Button>
      {loading && <LinearProgress />}
      {
        data.length > 0 && data ?
          (
            data.sort((a: any, b: any) => parseInt(a.id) + parseInt(b.id)).map((item, index) => {
              if (item.id === editConversation) {
                return (
                  <CreateConversation
                    isUpdate={true}
                    conversation={item}
                    onSaveCallback={onSaveCallBack}
                    conversationLastindex={index + 1}
                    onCancel={onCancel}
                  />
                );
              }
              return (
                <Accordion className={classes.listItemWrapper} key={index}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    id="conversationId"
                  >
                    <Typography className={classes.heading}>Conversation {index + 1}</Typography>
                  </AccordionSummary>
                  <AccordionDetails className={classes.listItem}>
                    <Grid className={classes.actionButtonWrapper}>
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
                        onConfirm={() => deleteConversationHandler(item.id)}
                      >
                        Are you sure you want to delete this Conversations?
                      </ConfirmDialog>
                    </Grid>
                    <Grid container={true} direction={'column'} className={classes.paper}>
                      <Grid container={true} className={classes.actionWrapper}>
                        <Grid container={true} item={true} className={classes.actionItemWrapper}>
                          <Typography> Turn </Typography>
                        </Grid>
                        <Grid container={true} item={true} className={classes.actionDetailsWrapper}>
                          <Typography> User Actions </Typography>
                        </Grid>
                        <Grid container={true} item={true} className={classes.actionDetailsWrapper}>
                          <Typography> Agent Actions </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container={true} direction={'column'} className={classes.paper}>
                      {
                        item.actions.map((item: any, index: number) => {
                          return (
                            <Grid container={true}
                              className={clsx(classes.actionWrapper, item.isAgent && classes.agentActionWrapper)}
                              key={index}>
                              <Grid container={true} item={true} className={classes.actionItemWrapper}>
                                <Typography> {item.turn} </Typography>
                              </Grid>
                              {item.isUser ? (
                                <Grid container={true} item={true} className={classes.actionsWrapper}>
                                  <span className={classes.agentTagText}>User Action</span>
                                  <Grid container={true} className={classes.actionDetailsWrapper} direction={'column'}>
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
                                        {
                                          item.tagValues?.map((item: any, i: number) => {
                                            const label = item.tagType + ' : ' + item.value;
                                            return (
                                              <li key={i}>
                                                <Chip
                                                  label={label}
                                                  className={classes.chip}
                                                />
                                              </li>
                                            );
                                          })
                                        }
                                      </Paper>
                                    </Grid>
                                  </Grid>
                                </Grid>

                              ) : (
                                  <Grid container={true} item={true} className={classes.actionsWrapper}>
                                    <span className={classes.agentTagText}>Agent Action</span>
                                    <Grid container={true} className={classes.actionDetailsWrapper} direction={'column'}>
                                      <Grid className={classes.contentTable}>
                                        <span className={classes.itemWrapper}>
                                          <h6>Action Type:</h6>
                                          <p>{item.actionId}</p>
                                        </span>
                                        <span className={classes.itemWrapper}>
                                          <h6>Action Type:</h6>
                                          <p>{item.actionType}</p>
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
                        })
                      }
                    </Grid>

                  </AccordionDetails>
                </Accordion>
              );
            })
          )
          : (
            <Typography align="center" variant="h6">
              {'No Conversation found'}
            </Typography>
          )
      }
      {
        createConversation && <CreateConversation onSaveCallback={onSaveCallBack} conversationLastindex={conversations.length + 1} />
      }
    </Paper>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '100%',
    },
    button: {
      margin: theme.spacing(1),
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    actionWrapper: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'unset',
      flexDirection: 'row',
    },
    agentTagText: {
      position: 'absolute',
      top: '-12px',
      backgroundColor: '#fff',
      padding: '2px 6px',
      left: '9px',
      fontSize: '12px',
    },
    tagList: {
      marginTop: '17px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'unset',
      position: 'relative',
    },
    agentActionWrapper: {
      justifyContent: 'space-between',
      margin: '12px 0 10px',
    },
    actionItemWrapper: {
      width: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
    actionsWrapper: {
      border: '1px solid #000',
      borderRadius: '3px',
      width: 'calc(50% - 50px)',
      position: 'relative',
    },
    actionDetailsWrapper: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      padding: '10px 0',
    },
    controlsWidth: {
      width: '20%',
      padding: '0px 3px',
      minWidth: '130px',
    },
    listItemWrapper: {
      margin: '0px 50px 20px !important',
      backgroundColor: '#fff',
      borderRadius: '5px',
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    saveButton: {
      width: '100px',
      marginTop: '20px',
    },
    listItem: {
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    selectControls: {
      width: '100%',
      color: 'black',
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

  }));
