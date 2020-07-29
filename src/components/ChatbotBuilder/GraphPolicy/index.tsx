import { useQuery, useMutation } from '@apollo/react-hooks';
import { Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import React, { useState } from 'react';
import {useParams} from 'react-router-dom';

import ContentLoading from '../../ContentLoading';
import GraphPoliciesTable from './GraphPoliciesTable';
import {getGraphPoliciesQuery, activateGraphPolicyMutation, deleteGraphPolicyMutation} from './gql';
import UpsertGraphPolicyDialog from './UpsertGraphPolicyDialog';
import { useSnackbar } from 'notistack';
import {IGetGraphPoliciesQueryResult} from './types';

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
    loader: {
      position: "absolute",
      top: theme.spacing(10),
      left: -(theme.spacing(5)),
      zIndex: 10
    }
  }),
);


export default function GraphPolicies() {
  const classes = useStyles();
  let { agentId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [upsertDialogOpen, setUpsertDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  agentId = parseInt(agentId);

  const queryResult = useQuery<IGetGraphPoliciesQueryResult>(getGraphPoliciesQuery, {
    fetchPolicy: "cache-and-network",
    variables: { agentId: parseInt(agentId) },
  });

  const [activatePolicy] = useMutation(activateGraphPolicyMutation,  {
    refetchQueries: [{ query: getGraphPoliciesQuery, variables: { agentId: agentId} }],
    awaitRefetchQueries: true,
  });

  const [deletePolicy] = useMutation(deleteGraphPolicyMutation,  {
    refetchQueries: [{ query: getGraphPoliciesQuery, variables: { agentId: agentId} }],
    awaitRefetchQueries: true,
  });

  const handleActivatePolicy = async(id: number) => {
    setLoading(true);
    await activatePolicy({
      variables: {
        agentId: agentId,
        id: id
      }
    });

    enqueueSnackbar("Activated Policy", { variant: "success" });
    setLoading(false);
  }

  const handleDeletePolicy = async(id: number) => {
    setLoading(true);
    try {
      await deletePolicy({
        variables: {
          id: id
        }
      });
      enqueueSnackbar("Deleted Policy", { variant: "success" });
    }
    catch(e) {
      console.log(e);
      enqueueSnackbar(`Could not delete policy. Error ${e.message}`, { variant: "error" });
    }
    setLoading(false);
  }

  const policies = queryResult.data?.ChatbotService_graphPolicies;

  return (
      <Grid container={true} spacing={2} className={classes.root}>
        <Grid item={true} xs={12}>          
          {
            queryResult?.loading ?
            <ContentLoading/>
            :
            <span/>
          }
          <GraphPoliciesTable loading={loading || queryResult?.loading } onActivate={handleActivatePolicy} 
            onDelete={handleDeletePolicy} policies={policies} onAdd={()=>setUpsertDialogOpen(true)} />
          
          <UpsertGraphPolicyDialog open={upsertDialogOpen} onSuccess={()=>queryResult?.refetch()} onCancel={()=>setUpsertDialogOpen(false)}/>
        </Grid>
      </Grid>
  );
}
