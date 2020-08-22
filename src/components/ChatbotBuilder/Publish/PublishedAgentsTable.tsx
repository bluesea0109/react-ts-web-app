import { Paper, TableContainer, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import _ from 'lodash';
import MaterialTable, { Column } from 'material-table';
import React, { useEffect } from 'react';
import { IPublishedAgent } from '../../../models/chatbot-service';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
    },
    title: {
      width: '100%',
    },
  }),
);

interface PublishedAgentsState {
  columns: Column<IPublishedAgent>[];
  data: IPublishedAgent[] | undefined;
}

interface PublishedAgentsTableProps {
  publishedAgents: IPublishedAgent[] | undefined;
  loading?: boolean;
  toolbarChildren?: any;
}

function PublishedAgentsTable({
  publishedAgents,
  loading,
  toolbarChildren,
}: PublishedAgentsTableProps) {
  const classes = useStyles();

  const [state, setState] = React.useState<PublishedAgentsState>({
    columns: [
      { title: 'Version Id', field: 'id', editable: 'never' },
      { title: 'Agent Id', field: 'agentId', editable: 'never' },
      { title: 'Status', field: 'status', editable: 'never' },
      { title: 'Created At', field: 'createdAt', editable: 'never' },
      {
        title: 'Agent Data',
        field: 'agentData',
        render: (agent) => JSON.stringify(agent, null, 2),
      },
    ],
    data: publishedAgents,
  });

  useEffect(() => {
    if (publishedAgents) {
      setState({
        columns: state.columns,
        data: [...publishedAgents],
      });
    }

    return () => {};
  }, [publishedAgents, state.columns]);

  return (
    <Paper className={classes.paper}>
      <TableContainer component={Paper} aria-label="Published Agents">
        <MaterialTable
          isLoading={loading}
          title={
            <Typography variant="h6" className={classes.title}>
              Published Agents {toolbarChildren}
            </Typography>
          }
          columns={state.columns}
          data={_.cloneDeep(state.data) || []}
          options={{
            actionsColumnIndex: -1,
            search: true,
            paging: true,
            pageSize: 10,
          }}
          actions={[]}
        />
      </TableContainer>
    </Paper>
  );
}

export default PublishedAgentsTable;
