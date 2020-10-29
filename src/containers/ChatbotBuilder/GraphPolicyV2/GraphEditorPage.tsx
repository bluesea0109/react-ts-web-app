import { Card, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import React, { useEffect, useState } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import GraphEditor from './GraphEditor';

import GraphEditorMenu from './GraphEditorMenu';

interface IParams {
  entityId: string;
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
  const [, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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
          <GraphEditor />
        </Card>
      </div>
    </div>
  );
};
export default GraphEditorPage;
