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
  query ($article: String, $maxWords: Int) {
    bertExtractiveSummary(article: $article, maxWords: $maxWords)
  }
`;

export default function TextSummarization() {
  const client = useApolloClient();
  const classes = useStyles();

  const [state, setState] = useState({
    article: '',
    summary: '',
    maxWords: 200,
    loading: false,
  });

  const onSubmitClick = async () => {
    setState({ ...state, loading: true });

    const res = await client.query({
      query,
      variables: {
        article: state.article,
        maxWords: state.maxWords,
      },
    });

    setState({ ...state, loading: false, summary: res.data.bertExtractiveSummary });
  };

  let summary: any = null;

  if (state.loading) {
    summary = <ContentLoading />;
  } else {
    summary = (
      <React.Fragment>
        <Grid item={true} xs={12} sm={12}>
          <TextField
            className={classes.textArea}
            id="summary"
            label="Summary"
            multiline={true}
            rows={8}
            value={state.summary}
            variant="outlined"
          />
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <form className={classes.root} noValidate={true} autoComplete="off">

      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <Typography variant="h4">{'Extractive Text Summarization'}</Typography>
        </Grid>
        <Grid item={true} xs={12} sm={12}>
          <TextField
            className={classes.textArea}
            id="article"
            label="Text"
            multiline={true}
            rows={12}
            variant="outlined"
            onChange={(e) => setState({ ...state, article: e.target.value })}
            value={state.article}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12}>
          <TextField
            id="max-words"
            label="Max Words"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            onChange={(e) => setState({ ...state, maxWords: parseInt(e.target.value) })}
            value={state.maxWords}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <Button variant="contained" onClick={onSubmitClick}>{'Submit'}</Button>
        </Grid>
        {summary}
      </Grid>
    </form>
  );
}
