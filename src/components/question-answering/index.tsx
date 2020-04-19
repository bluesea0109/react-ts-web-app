import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, TextField, Grid } from '@material-ui/core';
import { ApolloClient, HttpLink, InMemoryCache, gql, useLazyQuery } from '@apollo/client';
import ContentLoading from '../ContentLoading';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'https://prediction-service-dot-bavard-dev.appspot.com/graphql',
  })
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {

    },
    textArea: {
      width: '100%'
    },
    divider: {
      height: 2,
      background: 'black'
    }
  }),
);

const query = gql`
query ($context: String, $question: String) {
  bertQa(context: $context, question: $question)
}
`;

export default function BasicTextFields() {
  const classes = useStyles();

  const [state, setState] = useState({
    context: 'The man went to the store to buy a gallon of milk.',
    question: 'What did the man buy?',
  });

  const [getAnswer, { called, loading, data }] = useLazyQuery(query, {
    variables: {
      context: state.context,
      question: state.question
    },
    client,
    fetchPolicy: 'network-only'
  });


  const onSubmitClick = async () => {
    getAnswer();
  }

  let answer: any = null;

  if (called && loading) {
    answer = <ContentLoading />;
  }
  else {
    let answerVal: any = '';
    if (data && data.bertQa) {
      answerVal = data.bertQa;
    }

    answer = (
      <React.Fragment>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textArea}
            id="answer"
            label="answer"
            multiline
            rows={4}
            value={answerVal}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
        </Grid>
      </React.Fragment>
    )
  }

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textArea}
            id="context"
            label="Context"
            multiline
            rows={4}
            defaultValue="Default Value"
            variant="outlined"
            onChange={(e) => setState({ ...state, context: e.target.value })}
            value={state.context}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textArea}
            id="question"
            label="Question"
            multiline
            rows={4}
            variant="outlined"
            onChange={(e) => setState({ ...state, question: e.target.value })}
            value={state.question}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={onSubmitClick}>{"Submit"}</Button>
        </Grid>
        {answer}
      </Grid>
    </form>
  );
}