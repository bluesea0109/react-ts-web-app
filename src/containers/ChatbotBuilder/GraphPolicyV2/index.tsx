import { useMutation } from '@apollo/client';

import { Button } from '@bavard/react-components';
import { Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { currentUser } from '../../../atoms';
import {
  CHATBOT_GET_AGENT,
  CHATBOT_UPDATE_AGENT,
} from '../../../common-gql-queries';
import { exportJsonFileFromObj } from '../../../utils/exports';
import { createAgentPath } from '../../../utils/string';
import { currentAgentConfig } from '../atoms';
import UploadGraphPolicyDialog from './UploadGraphPolicyDialog';
import CreateGraphPolicyDialog from './CreateGraphPolicyDialog';
import GraphPoliciesTable from './GraphPoliciesTable';
import ApolloErrorPage from '../../ApolloErrorPage';

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
  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);
  const { enqueueSnackbar } = useSnackbar();
  const [upsertDialogOpen, setUpsertDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useRecoilState(currentAgentConfig);
  const [user] = useRecoilState(currentUser);
  const history = useHistory();

  const [updateAgent, updateAgentResult] = useMutation(CHATBOT_UPDATE_AGENT);

  if (!config || !user) {
    return <Typography>No Data Available</Typography>;
  }

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
      config.deleteGraphPolicyV2(name);

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
    return enqueueSnackbar(`Policy not found`, {
      variant: 'error',
    });
  };

  const handleViewPolicy = async (policyName: string) => {
    const policy = config.getGraphPolicyV2(policyName);

    if (!policy) {
      return notFoundError();
    }

    const route = createAgentPath(user, agentId, 'graph-editor', policyName);

    history.push(route);
  };

  const handleExport = async (policyName: string) => {
    setLoading(true);
    const policy = config.getGraphPolicyV2(policyName);

    if (!policy) {
      return notFoundError();
    }
    exportJsonFileFromObj(
      policy.toJsonObj(),
      `graph_policy_${policy.name}.json`,
    );
    setLoading(false);
  };

  const policies = config.getGraphPoliciesV2() || [];

  if (updateAgentResult.error) {
    return <ApolloErrorPage error={updateAgentResult.error} />;
  }

  return (
    <Grid container={true} style={{ padding: '50px' }}>
      <Grid item={true} xs={12}>
        <Grid style={{ fontSize: '26px', marginBottom: '24px' }}>
          Graph Policy
        </Grid>
        <GraphPoliciesTable
          loading={loading}
          onActivate={handleActivatePolicy}
          onDelete={handleDeletePolicy}
          onView={handleViewPolicy}
          onExport={handleExport}
          activePolicyName={config.activePolicyName}
          policies={policies}
          toolbarChildren={
            <React.Fragment>
              <Button
                title="Create Policy"
                variant={'contained'}
                className={classes.createButton}
                color="primary"
                onClick={() => {
                  setUpsertDialogOpen(true);
                }}
              />
              <Button
                title="Upload Policy"
                variant={'contained'}
                className={classes.createButton}
                color="primary"
                onClick={() => setUploadDialogOpen(true)}
              />
            </React.Fragment>
          }
        />
        {upsertDialogOpen && (
          <CreateGraphPolicyDialog
            open={upsertDialogOpen}
            onSuccess={() => {
              setUpsertDialogOpen(false);
            }}
            onCancel={() => {
              setUpsertDialogOpen(false);
            }}
            agentId={agentId}
          />
        )}

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
