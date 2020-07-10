import { useMutation, useQuery } from '@apollo/react-hooks';
import { Button, Grid, TextareaAutosize, LinearProgress } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { IIntent } from '../../../models/chatbot-service';
import { useParams } from 'react-router-dom';
import { CREATE_EXAMPLE, GET_EXAMPLES, CHATBOT_GET_INTENTS } from '../../../common-gql-queries';
import AutoComplete from '../../Utils/Autocomplete';


interface ICreateExampleProps {
  onCompleted?(): any;
}
interface IGetIntents {
  ChatbotService_intents: IIntent[] | undefined;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      padding: theme.spacing(2),
      border: `1px solid #000`,
      marginBottom: theme.spacing(2),
      borderRadius: `4px`,
      position: `relative`
    },
    label: {
      position: `absolute`,
      top: `-26px`,
      left: `20px`,
      background: `white`,
      padding: `0px 5px`,
    },
    textArea: {
      minWidth: '90%'
    },
    createBtn: {
      float: `right`,
      marginTop: `10px`,
      marginRight: `9%`,
    }
  }),
);

function CreateExample() {
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const classes = useStyles();
  const intentsData = useQuery<IGetIntents>(CHATBOT_GET_INTENTS, { variables: { agentId: numAgentId } });
  const intents = intentsData.data && intentsData.data.ChatbotService_intents;
  const [intentSelectedValue, setIntentSelectedValue] = React.useState<any | null>(null);
  const [createExample, { loading, error }] = useMutation(CREATE_EXAMPLE,
    {
      refetchQueries: [{ query: GET_EXAMPLES, variables: { agentId: numAgentId } }],
      awaitRefetchQueries: true,
    },
  );

  const [state, setState] = useState({
    name: '',
    open: false,
  });


  const handleChange = (event: any) => {
    setState({
      ...state,
      name: event.target.value,
    });
  };

  const handleCreate = () => {
    if (state.name) {
      createExample({
        variables: {
          agentId: numAgentId,
          text: state.name,
          intentId: intentSelectedValue,
        },
      });
    }

    setState({
      ...state,
      name: '',
    });
  };






  if (error) {
    console.error(error);
  }

  return (
    <React.Fragment>
      {loading && <LinearProgress />}
      <Grid container={true} spacing={1} className={classes.box}>
      <p className={classes.label}>Create NLU Example</p>
        <Grid item={true} xs={12} sm={3}>
          <AutoComplete
            options={intents}
            value={intentSelectedValue}
            label="Intents"
            onChange={(event: any, newValue: any | null) => {
              setIntentSelectedValue(newValue.id);
            }
            }
          />
        </Grid>

        <Grid item={true} xs={12} sm={9}>

          <TextareaAutosize 
            value={state.name} onChange={handleChange}
            rowsMin={4} placeholder="Text" className={classes.textArea}  />

          <Button
            variant="outlined" color="secondary"
            disabled={loading || error != null}
            onClick={handleCreate}
            className={classes.createBtn}
          >
            {'Add NLU Example'}
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default CreateExample;
