import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';
import Highlight from 'react-highlight';
import { useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { currentAgentConfig } from '../atoms';
import example from './example';
import UploadDataDialog from './UploadDataDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflow: 'auto',
      padding: theme.spacing(2),
    },
  }),
);
export default function UploadDataTab() {
  const classes = useStyles();
  const { agentId, workspaceId } = useParams<{
    agentId: string;
    workspaceId: string;
  }>();
  const [config] = useRecoilState(currentAgentConfig);

  if (!config) {
    return (
      <div className={classes.root}>
        <Typography variant={'h4'}>No Assistant Selected</Typography>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={3}>
          <UploadDataDialog
            uname={config.uname}
            agentId={parseInt(agentId)}
            workspaceId={workspaceId}
            buttonsDisabled={false}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <Typography>
            {
              'You may upload assistant data as a JSON file with the following format'
            }
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <Highlight className="json">{example}</Highlight>
        </Grid>
      </Grid>
    </div>
  );
}
