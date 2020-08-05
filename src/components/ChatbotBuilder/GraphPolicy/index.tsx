import { useMutation, useQuery } from '@apollo/client';
import { Button, Dialog, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

import React, { useState } from 'react';
import {useParams} from 'react-router-dom';

import { useSnackbar } from 'notistack';
import {IAgentGraphPolicy} from '../../../models/chatbot-service';
import {activateGraphPolicyMutation, deleteGraphPolicyMutation, getGraphPoliciesQuery} from './gql';
import GraphPoliciesTable from './GraphPoliciesTable';
import GraphVisualizer from './GraphVisualizer';
import {IGetGraphPoliciesQueryResult} from './types';
import UploadGraphPolicyDialog from './UploadGraphPolicyDialog';

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
    policyDialog: {
      backgroundColor: theme.palette.background.paper,
    },
    dialogClose: {
      float: 'right',
      cursor: 'pointer',
      position: 'fixed',
      top: theme.spacing(2),
      right: theme.spacing(2),
    },
    dialogTitle: {
      position: 'absolute',
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
    createButton: {
      margin: theme.spacing(1),
    },
  }),
);

export default function GraphPolicies() {
  const classes = useStyles();
  let { agentId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [upsertDialogOpen, setUpsertDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedPolicy, selectPolicy] = useState<IAgentGraphPolicy|undefined>();

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
      console.error(e);
      enqueueSnackbar(`Could not delete policy. Error ${e.message}`, { variant: 'error' });
    }
    setLoading(false);
  };

  const handleViewPolicy = async(policy: IAgentGraphPolicy) => {
    selectPolicy(policy);
    setUpsertDialogOpen(true);
  };

  const handleClosePolicy = () => {
    selectPolicy(undefined);
    setUpsertDialogOpen(false);
  };

  const policies = queryResult.data?.ChatbotService_graphPolicies;

  return (
      <Grid container={true} spacing={2} className={classes.root}>
        <Grid item={true} xs={12}>
          <GraphPoliciesTable loading={loading || queryResult?.loading } onActivate={handleActivatePolicy}
            onDelete={handleDeletePolicy}
            onView={handleViewPolicy}
            policies={policies}
            toolbarChildren={
              <React.Fragment>
                <Button variant={'contained'} className={classes.createButton} color="primary"
                  onClick={() => setUpsertDialogOpen(true)}>Create Policy</Button>
                <Button variant={'contained'} className={classes.createButton} color="primary"
                  onClick={() => setUploadDialogOpen(true)}>Upload Policy</Button>
              </React.Fragment>
            }
            />

            <Dialog open={upsertDialogOpen} fullScreen={true} scroll={'body'} className={classes.policyDialog}>
              <CloseRoundedIcon className={classes.dialogClose} onClick={handleClosePolicy}/>
              <GraphVisualizer policy={selectedPolicy}/>
            </Dialog>

          {<UploadGraphPolicyDialog
            open={uploadDialogOpen}
            onSuccess={() => queryResult?.refetch()}
            onCancel={() => setUploadDialogOpen(false)}/>}
        </Grid>
      </Grid>
  );
}
