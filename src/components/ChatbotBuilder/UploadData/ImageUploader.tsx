import { useQuery } from '@apollo/client';
import {
  createStyles,
  LinearProgress,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import { Cancel, CheckCircle } from '@material-ui/icons';
import React, { useState } from 'react';
import { uploadFileWithFetch } from '../../../utils/xhr';
import { botIconUploadQuery } from '../AgentSettings/gql';
import { getSignedImgUploadUrlQuery } from '../GraphPolicy/gql';

interface IProps {
  file: File;
  agentId: number;
  uniqueId: string;
  type: 'uro-images' | 'bot-icons';
  onSuccess?: (uniqueId: string) => void;
  onError?: (uniqueId: string, error: Error) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: 100,
      height: 100,
      margin: theme.spacing(1),
      padding: theme.spacing(2),
      textAlign: 'center',
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      display: 'inline-block',
    },
    filename: {
      height: 70,
      overflow: 'hidden',
    },
    success: {
      color: theme.palette.secondary.main,
    },
    error: {
      color: theme.palette.error.main,
    },
  }),
);

function UploadDataDialog({
  file,
  type,
  agentId,
  uniqueId,
  onSuccess,
  onError,
}: IProps) {
  const classes = useStyles();
  let query = getSignedImgUploadUrlQuery;

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'uploading' | 'completed' | 'error'>(
    'uploading',
  );

  if (type === 'bot-icons') {
    query = botIconUploadQuery;
  }

  useQuery(query, {
    variables: {
      agentId,
      basename: file.name,
    },
    onCompleted: async (d) => {
      setStatus('uploading');
      console.log('GOT IMG UPLOAD URL ', d);

      let url: string | undefined;
      if (d.ChatbotService_imageOptionUploadUrl.url) {
        url = d?.ChatbotService_imageOptionUploadUrl?.url;
      } else if (d?.ChatbotService_botIconUploadUrl?.url) {
        url = d?.ChatbotService_botIconUploadUrl?.url;
      }

      setProgress(50);
      console.log({ url });
      try {
        if (!url) {
          throw new Error('Could not get upload url');
        }
        const uploadResult = await uploadFileWithFetch(file, url, 'PUT');
        console.log('UPLOAD RESULT: ', uploadResult);
        setStatus('completed');
        setProgress(100);
        onSuccess?.(uniqueId);
      } catch (e) {
        setProgress(0);
        setStatus('error');
        onError?.(uniqueId, e);
      }
    },
    onError: (e) => {
      setProgress(0);
      onError?.(uniqueId, e);
    },
  });

  return (
    <Paper className={classes.container}>
      <Typography variant="subtitle1" className={classes.filename}>
        {file.name}
      </Typography>

      {status === 'completed' && <CheckCircle className={classes.success} />}
      {status === 'error' && <Cancel className={classes.error} />}
      {<LinearProgress variant="determinate" value={progress} />}
    </Paper>
  );
}

export default UploadDataDialog;
