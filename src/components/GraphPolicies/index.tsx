import { useApolloClient } from '@apollo/react-hooks';
import { Button, Grid, TextField, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import ContentLoading from '../ContentLoading';
import GraphPoliciesTable from './GraphPoliciesTable';
import UpsertGraphPolicyDialog from './UpsertGraphPolicyDialog';
// import GraphPolicy from '@bavard/graph-policy';

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

const graphPoliciesDummy = [
  {
    id: 1,
    name: "Test Policy 1",
  },
  {
    id: 2,
    name: "Test Policy 2"
  },
  {
    id: 4,
    name: "Test Policy 3"
  },
]

export default function GraphPolicies() {
  const classes = useStyles();
  const client = useApolloClient();

  // const [state, setState] = useState({
  //   context: 'The man went to the store to buy a gallon of milk.',
  //   question: 'What did the man buy?',
  //   answer: '',
  //   loading: false,
  // }) 

  return (
      <Grid container={true} spacing={2} className={classes.root}>
        <Grid item={true} xs={12}>
          <GraphPoliciesTable policies={graphPoliciesDummy} />
          <UpsertGraphPolicyDialog/>
        </Grid>
      </Grid>
  );
}
