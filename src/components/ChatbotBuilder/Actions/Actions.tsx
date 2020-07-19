import { Grid, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ActionsTable from './ActionsTable';
import { Maybe } from '../../../utils/types';
import { useQuery } from '@apollo/react-hooks';
import { getActionsQuery } from './gql';
import { ActionType, AnyAction } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import { GetActionsQueryResult } from './types';
import EditAction from './EditAction';

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
  const numAgentId = Number(agentId);

  const defaultActionVal: AnyAction = {
    id: -1,
    agentId: numAgentId,
    name: '',
    type: ActionType.NEW_ACTION,
    text: ''
  }

  const [currentAction, setCurrentAction] = useState<Maybe<number>>();
  const [newAction, setNewAction] = useState<boolean>(false);
  
  const { data, loading, error } = useQuery<GetActionsQueryResult>(getActionsQuery, {
    variables: { agentId: numAgentId },
  });

  const actions: Maybe<AnyAction[]> = data?.ChatbotService_actions;

  const commonError = error;

  if (commonError) {
    // TODO: handle errors
    return <ApolloErrorPage error={commonError} />;
  }

  const onEditActionClose = () => {
    setCurrentAction(null);
    setNewAction(false);
  };

  return (
    <div className={classes.root}>
      <Grid item={true} xs={12} sm={12}>
        <Paper className={classes.paper}>
          {agentId ? (
            <ActionsTable
              loading={loading}
              actions={actions ?? []}
              onEditAction={setCurrentAction}
              onAdd={() => setNewAction(true)}
            />
          ) : (
            <Typography>{'No Action is found'}</Typography>
          )}
        </Paper>
      </Grid>
      {!!actions && (
        <EditAction
          loading={loading}
          action={newAction ? defaultActionVal : actions.find(x => x.id === currentAction)}
          onEditActionClose={onEditActionClose}
        />
      )}
    </div>
  );
};

export default Actions;
