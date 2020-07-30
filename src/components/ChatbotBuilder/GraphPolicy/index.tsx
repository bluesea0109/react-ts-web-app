import { useMutation, useQuery } from '@apollo/react-hooks';
import { Dialog, Fab, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

import React, { useState } from 'react';
import {useParams} from 'react-router-dom';

import { useSnackbar } from 'notistack';
import {IAgentGraphPolicy} from '../../../models/graph-policy';
import ContentLoading from '../../ContentLoading';
import {activateGraphPolicyMutation, deleteGraphPolicyMutation, getGraphPoliciesQuery} from './gql';
import GraphPoliciesTable from './GraphPoliciesTable';
import GraphVisualizer from './GraphVisualizer';
import {IGetGraphPoliciesQueryResult} from './types';
import UpsertGraphPolicyDialog from './UpsertGraphPolicyDialog';

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
      position: 'absolute',
      top: theme.spacing(10),
      left: -(theme.spacing(5)),
      zIndex: 10,
    },
    addButton: {
      position: 'absolute',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
    },
    dialogClose: {
      float: 'right',
      cursor: 'pointer',
      position: 'absolute',
      top: theme.spacing(2),
      right: theme.spacing(2),
    },
    dialogTitle: {
      position: 'absolute',
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  }),
);

export default function GraphPolicies() {
  const classes = useStyles();
  let { agentId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [upsertDialogOpen, setUpsertDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedPolicy, selectPolicy] = useState<IAgentGraphPolicy|null>(null);

  agentId = parseInt(agentId);

  const queryResult = useQuery<IGetGraphPoliciesQueryResult>(getGraphPoliciesQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { agentId: parseInt(agentId) },
  });

  const [activatePolicy] = useMutation(activateGraphPolicyMutation,  {
    refetchQueries: [{ query: getGraphPoliciesQuery, variables: { agentId} }],
    awaitRefetchQueries: true,
  });

  const [deletePolicy] = useMutation(deleteGraphPolicyMutation,  {
    refetchQueries: [{ query: getGraphPoliciesQuery, variables: { agentId} }],
    awaitRefetchQueries: true,
  });

  const handleActivatePolicy = async(id: number) => {
    setLoading(true);
    await activatePolicy({
      variables: {
        agentId,
        id,
      },
    });

    enqueueSnackbar('Activated Policy', { variant: 'success' });
    setLoading(false);
  };

  const handleDeletePolicy = async(id: number) => {
    setLoading(true);
    try {
      await deletePolicy({
        variables: {
          id,
        },
      });
      enqueueSnackbar('Deleted Policy', { variant: 'success' });
    } catch (e) {
      console.log(e);
      enqueueSnackbar(`Could not delete policy. Error ${e.message}`, { variant: 'error' });
    }
    setLoading(false);
  };

  const handleViewPolicy = async(policy: IAgentGraphPolicy) => {
    selectPolicy(policy);
    setViewDialogOpen(true);
  };

  const handleClosePolicy = () => {
    selectPolicy(null);
    setViewDialogOpen(false);
  };

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
            onDelete={handleDeletePolicy}
            onView={handleViewPolicy}
            policies={policies} />

          {
            selectedPolicy ?
            <Dialog open={viewDialogOpen} fullScreen={true} scroll={'body'}>
              <Typography className={classes.dialogTitle}>
                Graph Policy {selectedPolicy.name}
              </Typography>
              <CloseRoundedIcon className={classes.dialogClose} onClick={handleClosePolicy}/>
              <GraphVisualizer policy={selectedPolicy}/>
            </Dialog>
            :
            <></>
          }

          <UpsertGraphPolicyDialog
            open={upsertDialogOpen}
            onSuccess={() => queryResult?.refetch()}
            onCancel={() => setUpsertDialogOpen(false)}/>
        </Grid>
        <Fab color="primary" aria-label="add" onClick={() => setUpsertDialogOpen(true)} className={classes.addButton}>
          <AddIcon />
        </Fab>
      </Grid>
  );
}
