import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import ContentLoading from '../../ContentLoading';

interface IProps {
  file: File;
  agentId: number;
  type: 'uro-images' | 'bot-icons';
  onSuccess?: () => void;
  onError?: () => void;
  onCancel?: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: 100,
      height: 100,
      margin: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
    },
  }),
);

function UploadDataDialog({ file, agentId }: IProps) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {agentId} {file.type}
      {file.name} {file.size}
      <ContentLoading />
    </div>
  );
}

export default UploadDataDialog;
