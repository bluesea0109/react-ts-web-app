import { Card, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { useQuery } from '@apollo/client';
import { GraphPolicyV2 } from '@bavard/agent-config/dist/graph-policy-v2';
import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { agentOptionImages, currentAgentConfig } from '../atoms';
import CreateGraphPolicyDialog from './CreateGraphPolicyDialog';
import { getOptionImagesQuery } from './gql';
import { IGetOptionImagesQueryResult } from './types';
import clsx from 'clsx';

import GraphEditor from './GraphEditor';
import GraphEditorMenu from './GraphEditorMenu';

interface IParams {
  entityId: string;
  agentId: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    styledScrollbars: {
      '&::-webkit-scrollbar': {
        opacity: 0,
        width: '0.4em',
        height: '.4em',
      },
      '&::-webkit-scrollbar-track': {
        opacity: 0,
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
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
      width: 300,
    },
    editorMenuItems: {
      marginTop: theme.spacing(2),
      height: `calc(100vh - 260px)`,
      overflowX: 'hidden',
      overflowY: 'scroll',
    },
  }),
);

const GraphEditorPage = () => {
  const classes = useStyles();
  const { entityId, agentId }: IParams = useParams();
  const [, setOptionImages] = useRecoilState(agentOptionImages);
  const [agentConfig] = useRecoilState(currentAgentConfig);
  const containerRef = useRef<HTMLDivElement>(null);

  const imgQuery = useQuery<IGetOptionImagesQueryResult>(getOptionImagesQuery, {
    variables: { agentId: parseInt(agentId) },
    onCompleted: (data) => {
      setOptionImages({
        images: data.ChatbotService_optionImages || [],
        refetch: imgQuery.refetch,
      });
    },
  });

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

  return (
    <div>
      <div className={classes.editorContent}>
        <div className={classes.editorMenu}>
          <Typography variant="h6">Visual Graph Builder</Typography>
          Drag and drop the nodes and edges onto the canvas to create a
          representation of your assistant's flow.
          <GraphEditorMenu
            className={clsx([
              classes.editorMenuItems,
              classes.styledScrollbars,
            ])}
          />
        </div>
        <Card
          ref={containerRef}
          className={clsx([
            classes.graphEditorContainer,
            classes.styledScrollbars,
          ])}
          style={{ width: getEditorWidth(), height: getEditorHeight() }}>
          {gp && <GraphEditor policy={gp} agentId={parseInt(agentId)} />}
        </Card>
      </div>
      {!gp && (
        <CreateGraphPolicyDialog agentId={parseInt(agentId)} open={true} />
      )}
    </div>
  );
};
export default GraphEditorPage;
