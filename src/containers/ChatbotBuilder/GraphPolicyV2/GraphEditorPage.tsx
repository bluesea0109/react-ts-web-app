import { Card, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { agentOptionImages } from '../atoms';
import CreateGraphPolicyDialog from './CreateGraphPolicyDialog';
import { getOptionImagesQuery } from './gql';
import { IGetOptionImagesQueryResult } from './types';

import GraphEditor from './GraphEditor';
import GraphEditorMenu from './GraphEditorMenu';

interface IParams {
  entityId: string;
  agentId: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    graphEditorContainer: {
      width: '100%',
      minHeight: '70vh',
      display: 'block',
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
    },
  }),
);

const GraphEditorPage = () => {
  const classes = useStyles();
  const { entityId, agentId }: IParams = useParams();
  const [, setOptionImages] = useRecoilState(agentOptionImages);

  const imgQuery = useQuery<IGetOptionImagesQueryResult>(getOptionImagesQuery, {
    variables: { agentId: parseInt(agentId) },
    onCompleted: (data) => {
      setOptionImages({
        images: data.ChatbotService_optionImages || [],
        refetch: imgQuery.refetch,
      });
    },
  });

  return (
    <div className="page-container">
      <div className={classes.editorContent}>
        <div className={classes.editorMenu}>
          <Typography variant="h6">Visual Graph Builder</Typography>
          Drag and drop the nodes and edges onto the canvas to create a
          representation of your assistant's flow.
          <GraphEditorMenu className={classes.editorMenuItems} />
        </div>
        <Card className={classes.graphEditorContainer}>
          <GraphEditor agentId={parseInt(agentId)} />
        </Card>
      </div>
      {!entityId && (
        <CreateGraphPolicyDialog agentId={parseInt(agentId)} open={true} />
      )}
    </div>
  );
};
export default GraphEditorPage;
