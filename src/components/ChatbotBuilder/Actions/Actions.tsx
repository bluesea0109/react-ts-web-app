import { BaseAgentAction } from '@bavard/agent-config';
import { Grid, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Maybe } from '../../../utils/types';
import { currentAgentConfig } from '../atoms';
import ActionsTable from './ActionsTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      overflow: 'auto',
    },
    paper: {
      padding: theme.spacing(2),
    },
  }),
);

const Actions = () => {
  const classes = useStyles();
  const { agentId } = useParams();
  const config = useRecoilValue(currentAgentConfig);

  // eslint-disable-next-line
  const [currentAction, setCurrentAction] = useState<Maybe<string>>();
  // eslint-disable-next-line
  const [newAction, setNewAction] = useState<boolean>(false);

  const actions: Maybe<BaseAgentAction[]> = config?.getActions();

  return (
    <div className={classes.root}>
      <Grid item={true} xs={12} sm={12}>
        <Paper className={classes.paper}>
          {agentId ? (
            <ActionsTable
              loading={false}
              actions={actions ?? []}
              onEditAction={setCurrentAction}
              onAdd={() => setNewAction(true)}
            />
          ) : (
              <Typography>{'No Action is found'}</Typography>
            )}
        </Paper>
      </Grid>
    </div>
  );
};

export default Actions;
