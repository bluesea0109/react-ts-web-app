import { useMutation, useQuery } from '@apollo/client';
import { GraphPolicyV2 } from '@bavard/agent-config/dist/graph-policy-v2';
import { Card, Typography, Grid } from '@material-ui/core';
import { BlockingLoader } from '@bavard/react-components';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import {
  CHATBOT_GET_AGENT,
  CHATBOT_SAVE_CONFIG_AND_SETTINGS,
} from '../../../common-gql-queries';
import {
  agentOptionImages,
  currentAgentConfig,
  currentWidgetSettings,
} from '../atoms';
import CreateGraphPolicyDialog from './CreateGraphPolicyDialog';
import { getOptionImagesQuery } from './gql';
import GraphEditor from './GraphEditor';
import GraphEditorMenu from './GraphEditorMenu';
import { IGetOptionImagesQueryResult } from './types';
import ContentLoading from '../../ContentLoading';

interface IParams {
  entityId: string;
  agentId: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    styledScrollbars: {
      '&::-webkit-scrollbar': {
        opacity: 0,
        width: '5px',
        height: '5px',
      },
      '&::-webkit-scrollbar-track': {
        opacity: 0,
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
        backgroundColor: 'rgba(0,0,0,.1)',
      },
      '&::-webkit-scrollbar-thumb': {
        opacity: 0,
        backgroundColor: 'rgba(0,0,0,.2)',
      },
      '&::-webkit-scrollbar-thumb:horizontal': {
        opacity: 0,
        backgroundColor: 'rgba(0,0,0,.2)',
      },
    },
    graphEditorContainer: {
      width: 'calc(100vw - 412px)',
      height: `calc(100vh - 120px)`,
      display: 'block',
      overflow: 'auto',
      borderRadius: 0,
      boxShadow: 'none',
      borderLeft: `solid 1px ${theme.palette.grey[300]}`,
    },
    editorContent: {
      display: 'flex',
    },
    editorMenu: {
      padding: theme.spacing(2),
      width: 250,
    },
    editorMenuItems: {
      marginTop: theme.spacing(2),
      height: `calc(100vh - 280px)`,
      overflowX: 'hidden',
      overflowY: 'scroll',
    },
  }),
);

const GraphEditorPage = () => {
  const classes = useStyles();
  const { entityId, agentId }: IParams = useParams();
  const [, setOptionImages] = useRecoilState(agentOptionImages);
  const [agentConfig, setAgentConfig] = useRecoilState(currentAgentConfig);
  const [widgetSettings] = useRecoilState(currentWidgetSettings);
  const containerRef = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  const imgQuery = useQuery<IGetOptionImagesQueryResult>(getOptionImagesQuery, {
    variables: { agentId: parseInt(agentId) },
    onCompleted: (data) => {
      setOptionImages({
        images: data.ChatbotService_optionImages || [],
        refetch: imgQuery.refetch,
      });
    },
  });

  const [updateAgent, updateAgentData] = useMutation(
    CHATBOT_SAVE_CONFIG_AND_SETTINGS,
    {
      refetchQueries: [
        { query: CHATBOT_GET_AGENT, variables: { agentId: Number(agentId) } },
      ],
      awaitRefetchQueries: true,
    },
  );

  let gp: GraphPolicyV2 | undefined;
  if (entityId) {
    gp = agentConfig?.getGraphPolicyV2(entityId);
  }

  const getEditorWidth = () => {
    const left = containerRef.current?.offsetLeft;
    return `calc(100vw - ${left ? left + 1 : 412}px)`;
  };

  const getEditorHeight = () => {
    const top = containerRef.current?.offsetTop;
    return `calc(100vh - ${top ? top : 120}px)`;
  };

  const handlePolicyChanged = async (policy: GraphPolicyV2) => {
    if (agentConfig) {
      try {
        agentConfig.deleteGraphPolicyV2(policy.name);
        agentConfig.addGraphPolicyV2(policy);
        setAgentConfig(agentConfig);
      } catch (e) {
        enqueueSnackbar(`Could not modify agent config - ${e.toString()}`, {
          variant: 'error',
        });
      }
    }
  };

  const handleSavePolicy = async (policy: GraphPolicyV2) => {
    if (agentConfig) {
      try {
        agentConfig.deleteGraphPolicyV2(policy.name);
        agentConfig.addGraphPolicyV2(policy);

        await updateAgent({
          variables: {
            agentId: Number(agentId),
            config: agentConfig.toJsonObj(),
            uname: agentConfig?.toJsonObj().uname,
            settings: widgetSettings,
          },
        });
        enqueueSnackbar('Graph policy & agent config updated', {
          variant: 'success',
        });
      } catch (e) {
        enqueueSnackbar(e.toString(), { variant: 'error' });
      }
    }
  };

  return (
    <React.Fragment>
      <Grid container={true} className={classes.editorContent}>
        <Grid
          item={true}
          className={classes.editorMenu}
          xs={12}
          sm={12}
          md={3}
          lg={3}>
          <Typography variant="h6">Visual Graph Builder</Typography>
          <Typography>
            {
              "Drag and drop the nodes and edges onto the canvas to create a\
          representation of your assistant's flow."
            }
          </Typography>
          <GraphEditorMenu
            className={clsx([
              classes.editorMenuItems,
              classes.styledScrollbars,
            ])}
          />
        </Grid>
        <Grid
          item={true}
          xs={12}
          sm={12}
          md={9}
          lg={9}
          className={clsx([
            classes.graphEditorContainer,
            classes.styledScrollbars,
          ])}>
          <Card ref={containerRef}>
            {updateAgentData.loading && <BlockingLoader />}
            {gp && (
              <GraphEditor
                policy={gp}
                agentId={parseInt(agentId)}
                onSave={handleSavePolicy}
                onPolicyChanged={handlePolicyChanged}
              />
            )}
          </Card>
        </Grid>
      </Grid>
      {!gp && (
        <CreateGraphPolicyDialog agentId={parseInt(agentId)} open={true} />
      )}
    </React.Fragment>
  );
};
export default GraphEditorPage;
