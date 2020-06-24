import { createStyles, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import { CHATBOT_TALK_TO_AGENT } from '../../../common-gql-queries';
import ContentLoading from '../../ContentLoading';
import ChatBox from './ChatBox';
import { useParams } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'auto',
      padding: theme.spacing(2),
    },
    textArea: {
      width: '100%',
    },
  }),
);

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ChatWithAgent() {
  const [state, setState] = useState({
    dialogue: '',
    userUtterance: ''
  });
  const [errStatus, setErrStatus] = useState('')
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const classes = useStyles();
  const [talkToAgent, { loading }] = useMutation(CHATBOT_TALK_TO_AGENT);

  if (loading) {
    return <ContentLoading />;
  }


  
  const onKeyDownHandler = async (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      try {
        const response = await talkToAgent({
          variables: {
            conversation : {
              agentId: numAgentId,
              dialogueTurns: [{actor: 'USER', utterance: state.userUtterance}],
           },
         }
        });
        console.log('response', response);
  
        setState({ ...state, userUtterance: '' })
      } catch (e) {
        if(e && e.graphQLErrors[0] && e.graphQLErrors[0].extensions && e.graphQLErrors[0].extensions.code === 'NO_MODEL' && e.graphQLErrors[0].message) {
          setErrStatus(e.graphQLErrors[0].message)
        } else {
          setErrStatus(e.graphQLErrors[0].message)
        }
      }

    }
  };
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState({ ...state,  userUtterance: e.target.value })
    setErrStatus('');
  }

  



  return (
    <div className={classes.root}>
      <Grid container={true} spacing={2}>
        <Grid item={true} container={true} xs={12}>
          <Grid item={true} xs={12} md={6}>
             {errStatus && <Alert severity="error">{errStatus}</Alert>}
             <ChatBox/>
          </Grid>
        </Grid>
        <Grid item={true} container={true} xs={12}>
          <Grid item={true} xs={12} md={6}>
            <TextField
              className={classes.textArea}
              id="message"
              label="Message"
              multiline={true}
              rows={1}
              variant="outlined"
              onChange={(e) => inputChangeHandler(e)}
              onKeyDown={onKeyDownHandler}
              value={state.userUtterance}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
