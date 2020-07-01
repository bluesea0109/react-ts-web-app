import {
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid, IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import { Delete, Edit, ExpandMore } from '@material-ui/icons';
import React, {useState } from 'react';
import { useQuery } from 'react-apollo';
import { useParams } from 'react-router-dom';
import {
  GET_TRAINING_CONVERSATIONS,
} from '../../../common-gql-queries';
import { ITrainingConversations } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import CreateConversation from './createTrainingConversations';

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
    actionItemWrapper: {
      width: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
    actionDetailsWrapper: {
      width: '50%',
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
      margin: '0px 50px !important',
      backgroundColor: '#fff',
      borderRadius: '5px',
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
      width: '65%',
      '& tr': {
        '& th': {
          color: '#777',
        },
        '& td': {
          textAlign: 'center',
          color: '#333',
        },
      },
    },

  }));

interface IGetTrainingConversation {
  ChatbotService_trainingConversations: ITrainingConversations[];
}
export default function TrainingConversations() {
  const classes = useStyles();
  const { agentId } = useParams();
  const [createConversation, setcreateConversation] = useState(false);
  const [editConversation, seteditConversation] = useState(0);
  const numAgentId = Number(agentId);
  const getTrainingConversations = useQuery<IGetTrainingConversation>(GET_TRAINING_CONVERSATIONS, { variables: { agentId: numAgentId } });
  let conversations = getTrainingConversations.data?.ChatbotService_trainingConversations || [];
  const refetchConversations = getTrainingConversations.refetch;

  const data = conversations.map((item: any) => {
    item.userActions.map((a: any) => a.isUser = true);
    item.agentActions.map((a: any) => a.isAgent = true);
    const arr = item.userActions.concat(item.agentActions).sort((a: any, b: any) => parseFloat(a.turn) - parseFloat(b.turn));
    return {actions: arr, id: item.id};
  });

  const onCreateNewConversation = () => {
    setcreateConversation(true);
  };

  if (getTrainingConversations.error) {
    return <ApolloErrorPage error={getTrainingConversations.error} />;
  }

  if (getTrainingConversations.loading) {
    return <ContentLoading />;
  }

  const onSaveCallBack = async () => {
    const refetchData = await refetchConversations();
    conversations = refetchData.data?.ChatbotService_trainingConversations || [];
    setcreateConversation(false);
  };
  const onEditConversation = (index: number) => {
      seteditConversation(index);
  }

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
      {
        data.length > 0 && data ?
          (
            data.map((item, index) => {
              if (item.id === editConversation) {
                return (
                  <CreateConversation
                    isUpdate={true}
                    conversation={item}
                    onSaveCallback={onSaveCallBack}
                    conversationLastindex={index + 1} />
                );
              }
              return (
                <ExpansionPanel className={classes.listItemWrapper} key={index}>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMore />}
                    id="conversationId"
                  >
                    <Typography className={classes.heading}>Conversation {index + 1}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.listItem}>
                   <Grid className={classes.actionButtonWrapper}>
                    <IconButton>
                      <Edit fontSize="large" onClick={() => onEditConversation(item.id)}/>
                    </IconButton>
                    <IconButton>
                      <Delete fontSize="large" />
                    </IconButton>
                   </Grid>
                    <Grid direction={'column'} className={classes.paper}>
                      <Grid container={true} className = {classes.actionWrapper}>
                        <Grid container={true} item={true} className = {classes.actionItemWrapper}>
                          <Typography> Turn </Typography>
                        </Grid>
                        <Grid container={true} item={true} className = {classes.actionDetailsWrapper}>
                          <Typography> User Actions </Typography>
                        </Grid>
                        <Grid container={true} item={true} className = {classes.actionDetailsWrapper}>
                          <Typography> Agent Actions </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid direction={'column'} className={classes.paper}>
                      {
                        item.actions.map((item: any, index: number) => {
                          return (
                            <Grid container={true} className = {classes.actionWrapper} key={index}>
                              <Grid container={true} item={true} className = {classes.actionItemWrapper}>
                                <Typography> {item.turn} </Typography>
                              </Grid>
                              {item.isUser ? (
                                <Grid container={true} item={true} className = {classes.actionDetailsWrapper}>
                                <table className={classes.contentTable}>
                                  <tbody>
                                    <tr>
                                      <th>Intent Name</th>
                                      <th>Tag Values</th>
                                      <th>Utterance</th>
                                    </tr>
                                    <tr>
                                      <td>{item.intent}</td>
                                      <td>{item.tagValues.map((item: any) => item.tagType + ',')}</td>
                                      <td>{item.utterance}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </Grid>
                              ) : (
                                <Grid container={true} item={true} justify={'flex-end'} >
                                <Grid container={true} item={true} className = {classes.actionDetailsWrapper}>
                                  <table className={classes.contentTable}>
                                    <tbody>
                                      <tr>
                                        <th>Action Id</th>
                                        <th>Action Type</th>
                                        <th>Utterance</th>
                                      </tr>
                                      <tr>
                                        <td>{item.actionId}</td>
                                        <td>{item.actionType}</td>
                                        <td>{item.utterance}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Grid>
                              </Grid>
                              )}
                            </Grid>
                          );
                        })
                      }
                    </Grid>

                  </ExpansionPanelDetails>
                </ExpansionPanel>
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
