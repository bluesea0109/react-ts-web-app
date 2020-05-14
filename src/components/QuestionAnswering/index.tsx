import { gql } from '@apollo/client';
import { useApolloClient } from '@apollo/client';
import { Button, Grid, TextField, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import ContentLoading from '../ContentLoading';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {

    },
    textArea: {
      width: '100%',
    },
    divider: {
      height: 2,
      background: 'black',
    },
  }),
);

const query = gql`
  query ($context: String, $question: String) {
    bertQa(context: $context, question: $question)
  }
`;

export default function QuestionAnswering() {
  const classes = useStyles();
  const client = useApolloClient();

  const [state, setState] = useState({
    context: 'The man went to the store to buy a gallon of milk.',
    question: 'What did the man buy?',
    answer: '',
    loading: false,
  });

  const onSubmitClick = async () => {
    setState({ ...state, loading: true });

    const res = await client.query({
      query,
      variables: {
        context: state.context,
        question: state.question,
      },
    });

    if (res.errors) {
      setState({ ...state, loading: false, answer: JSON.stringify(res.errors, null, 2) });
    } else {
      setState({ ...state, loading: false, answer: res.data.bertQa });
    }
  };

  let answer: any = null;

  if (state.loading) {
    answer = <ContentLoading />;
  } else {
    answer = (
      <React.Fragment>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            className={classes.textArea}
            id="answer"
            label="Answer"
            multiline={true}
            rows={8}
            value={state.answer}
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}/>
      </React.Fragment>
    );
  }

  return (
    <form className={classes.root} noValidate={true} autoComplete="off">
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <Typography variant="h4">{'Question Answering'}</Typography>
        </Grid>
        <Grid item={true} xs={12} sm={12}>
          <TextField
            className={classes.textArea}
            id="context"
            label="Context"
            multiline={true}
            rows={8}
            variant="outlined"
            onChange={(e) => setState({ ...state, context: e.target.value })}
            value={state.context}
          />
        </Grid>
        <Grid container={true} item={true} xs={12} sm={12} >
          <TextField
            className={classes.textArea}
            id="question"
            label="Question"
            multiline={true}
            rows={4}
            variant="outlined"
            onChange={(e) => setState({ ...state, question: e.target.value })}
            value={state.question}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <Button variant="contained" onClick={onSubmitClick}>{'Submit'}</Button>
        </Grid>
        {answer}
      </Grid>
    </form>
  );
}
