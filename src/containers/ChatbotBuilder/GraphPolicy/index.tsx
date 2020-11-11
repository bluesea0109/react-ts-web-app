import { useMutation } from '@apollo/client';
import { GraphPolicy } from '@bavard/agent-config';
import { Button, Dialog, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import {
  CHATBOT_GET_AGENT,
  CHATBOT_UPDATE_AGENT,
} from '../../../common-gql-queries';
import { exportJsonFileFromObj } from '../../../utils/exports';
import { currentAgentConfig } from '../atoms';
import GraphPoliciesTable from './GraphPoliciesTable';
import GraphVisualEditor from './GraphVisualEditor';
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
      left: -theme.spacing(5),
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
      zIndex: 1,
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
  let { agentId }: { agentId: any } = useParams<{ agentId: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const [upsertDialogOpen, setUpsertDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useRecoilState(currentAgentConfig);

  const [selectedPolicy, selectPolicy] = useState<GraphPolicy | undefined>();
  const [updateAgent] = useMutation(CHATBOT_UPDATE_AGENT);

  if (!config) {
    return <div>No agent selected</div>;
  }

  agentId = parseInt(agentId);

  const refetchQueries = [
    {
      query: CHATBOT_GET_AGENT,
      variables: {
        agentId,
      },
    },
  ];

  const handleActivatePolicy = async (name: string) => {
    setLoading(true);

    config.setActivePolicyName(name);

    const mutationResult = await updateAgent({
      variables: {
        agentId,
        config: config.toJsonObj(),
      },
      refetchQueries,
      awaitRefetchQueries: true,
    });

    setConfig(config);

    setLoading(false);

    if (mutationResult.errors?.length) {
      return enqueueSnackbar(JSON.stringify(mutationResult.errors), {
        variant: 'error',
      });
    }

    enqueueSnackbar('Activated Policy', { variant: 'success' });
  };

  const handleDeletePolicy = async (name: string) => {
    setLoading(true);
    try {
      config.deleteGraphPolicy(name);

      setConfig(config);
      const mutationResult = await updateAgent({
        variables: {
          agentId,
          config: config.toJsonObj(),
        },
        refetchQueries,
        awaitRefetchQueries: true,
      });

      if (mutationResult.errors?.length) {
        throw new Error(JSON.stringify(mutationResult.errors));
      }

      enqueueSnackbar('Deleted Policy', { variant: 'success' });
    } catch (e) {
      console.error(e);
      enqueueSnackbar(`Could not delete policy. Error ${e.message}`, {
        variant: 'error',
      });
    }
    setLoading(false);
  };

  const notFoundError = () => {
    return enqueueSnackbar(`Could not export, policy not found`, {
      variant: 'error',
    });
  };

  const handleViewPolicy = async (policyName: string) => {
    const policy = config.getGraphPolicy(policyName);

    if (!policy) {
      return notFoundError();
    }
    selectPolicy(policy);
    setUpsertDialogOpen(true);
  };

  const handleClosePolicy = () => {
    selectPolicy(undefined);
    setUpsertDialogOpen(false);
  };

  const handleExport = async (policyName: string) => {
    setLoading(true);
    const policy = config.getGraphPolicy(policyName);

    if (!policy) {
      return notFoundError();
    }
    exportJsonFileFromObj(
      policy.toJsonObj(),
      `graph_policy_${policy.policyName}.json`,
    );
    setLoading(false);
  };

  const policies = config.getGraphPolicies() || [];

  return (
    <Grid container={true} spacing={2} className={classes.root}>
      <Grid item={true} xs={12}>
        <GraphPoliciesTable
          loading={loading}
          onActivate={handleActivatePolicy}
          onDelete={handleDeletePolicy}
          onView={handleViewPolicy}
          onExport={handleExport}
          activePolicyName={config?.getActiveGraphPolicy()?.policyName}
          policies={policies}
          toolbarChildren={
            <React.Fragment>
              <Button
                variant={'contained'}
                className={classes.createButton}
                color="primary"
                onClick={() => setUpsertDialogOpen(true)}>
                Create Policy
              </Button>
              <Button
                variant={'contained'}
                className={classes.createButton}
                color="primary"
                onClick={() => setUploadDialogOpen(true)}>
                Upload Policy
              </Button>
            </React.Fragment>
          }
        />

        <Dialog
          open={upsertDialogOpen}
          fullScreen={true}
          scroll={'body'}
          className={classes.policyDialog}>
          <CloseRoundedIcon
            className={classes.dialogClose}
            onClick={handleClosePolicy}
          />
          <GraphVisualEditor
            agentConfig={config}
            policyName={selectedPolicy?.policyName}
            agentId={agentId}
          />
        </Dialog>

        {
          <UploadGraphPolicyDialog
            open={uploadDialogOpen}
            onSuccess={() => {}}
            onCancel={() => setUploadDialogOpen(false)}
          />
        }
      </Grid>
    </Grid>
  );
}
