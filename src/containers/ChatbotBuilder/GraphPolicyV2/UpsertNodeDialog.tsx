import { GraphPolicyNode } from '@bavard/agent-config/dist/graph-policy-v2';
import { FullDialog } from '@bavard/react-components';

import { Grid, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';

import { IGraphEditorNode } from './types';

import UpsertNodeForm from './UpsertNodeForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    gridContainer: {
      height: '100%',
    },
  }),
);

interface IProps {
  nodeId: number;
  agentId: number;
  editorNode: IGraphEditorNode;
  open?: boolean;
  onSuccess?: (node: GraphPolicyNode) => void;
  onDelete?: () => void;
  onClose?: () => void;
  intents?: string[];
}

const UpsertNodeDialog = ({
  open,
  nodeId,
  editorNode,
  onSuccess,
  onDelete,
  onClose,
  intents,
}: IProps) => {
  const [isOpen, setOpen] = useState(open || false);
  const classes = useStyles();

  const closeDialog = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <FullDialog
      isOpen={isOpen}
      title={nodeId ? 'Create a Node' : 'Update Node'}
      onClose={closeDialog}>
      <Grid
        container={true}
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.gridContainer}>
        <Grid item={true} xs={12} md={4}>
          <UpsertNodeForm
            actor={editorNode.actor}
            type={editorNode.type}
            nodeId={nodeId}
            node={editorNode.node?.toJsonObj()}
            onDelete={onDelete}
            onSubmit={onSuccess}
            intents={intents}
          />
        </Grid>
      </Grid>
    </FullDialog>
  );
};

export default UpsertNodeDialog;
