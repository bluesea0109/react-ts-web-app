import { useApolloClient } from '@apollo/client';
import { TextInput, Button } from '@bavard/react-components';
import { Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import ContentLoading from '../ContentLoading';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
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
  query($article: String, $maxWords: Int) {
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

    setState({
      ...state,
      loading: false,
      summary: res.data.bertExtractiveSummary,
    });
  };

  let summary: any = null;

  if (state.loading) {
    summary = <ContentLoading />;
  } else {
    summary = (
      <React.Fragment>
        <Grid item={true} xs={12} sm={12}>
          <TextInput
            id="summary"
            label="Summary"
            labelType="Typography"
            labelPosition="top"
            value={state.summary}
            rows={8}
            multiline={true}
            variant="outlined"
            className={classes.textArea}
          />
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <form className={classes.root} noValidate={true} autoComplete="off">
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <Typography variant="h4">
            {'Extractive Text Summarization'}
          </Typography>
        </Grid>
        <Grid item={true} xs={12} sm={12}>
          <TextInput
            className={classes.textArea}
            id="article"
            label="Text"
            labelType="Typography"
            labelPosition="top"
            multiline={true}
            rows={12}
            variant="outlined"
            onChange={(e) => setState({ ...state, article: e.target.value })}
            value={state.article}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12}>
          <TextInput
            id="max-words"
            label="Max Words"
            labelType="Typography"
            labelPosition="top"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            onChange={(e) =>
              setState({ ...state, maxWords: parseInt(e.target.value) })
            }
            value={state.maxWords}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <Button title="Submit" variant="contained" onClick={onSubmitClick} />
        </Grid>
        {summary}
      </Grid>
    </form>
  );
}
