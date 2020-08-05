import { useQuery } from '@apollo/client';
import { Grid, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ActionType, AnyAction } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import ApolloErrorPage from '../../ApolloErrorPage';
import { getOptionsQuery } from '../Options/gql';
import { GetOptionsQueryResult, IOption } from '../Options/types';
import ActionsTable from './ActionsTable';
import EditAction from './EditAction';
import { getActionsQuery } from './gql';
import { GetActionsQueryResult } from './types';

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
    text: '',
  };

  const [currentAction, setCurrentAction] = useState<Maybe<number>>();
  const [newAction, setNewAction] = useState<boolean>(false);

  const { data, loading, error } = useQuery<GetActionsQueryResult>(getActionsQuery, {
    variables: { agentId: numAgentId },
  });
  const optionsData = useQuery<GetOptionsQueryResult>(getOptionsQuery, {
    variables: { agentId: numAgentId },
  });

  const actions: Maybe<AnyAction[]> = data?.ChatbotService_actions;
  const options: Maybe<IOption[]> = optionsData.data?.ChatbotService_userResponseOptions;

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
              loading={loading || optionsData.loading}
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
          loading={loading || optionsData.loading}
          action={newAction ? defaultActionVal : actions.find(x => x.id === currentAction)}
          options={options ?? []}
          onEditActionClose={onEditActionClose}
        />
      )}
    </div>
  );
};

export default Actions;
