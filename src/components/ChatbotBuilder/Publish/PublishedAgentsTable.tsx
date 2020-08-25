import {
  IconButton,
  Paper,
  TableContainer,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import GetAppIcon from '@material-ui/icons/GetApp';
import _ from 'lodash';
import MaterialTable, { Column } from 'material-table';
import moment from 'moment';
import React, { useEffect } from 'react';
import { IPublishedAgent } from '../../../models/chatbot-service';
import { exportJsonFileFromObj } from '../../../utils/exports';

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
  containerClassName?: string;
}

function PublishedAgentsTable({
  publishedAgents,
  loading,
  toolbarChildren,
  containerClassName,
}: PublishedAgentsTableProps) {
  const classes = useStyles();

  const downloadJson = (data: any, agentId: number, version: number) => {
    exportJsonFileFromObj(data, `agent_${agentId}_v${version}.json`);
  };

  const [state, setState] = React.useState<PublishedAgentsState>({
    columns: [
      { title: 'Version Id', field: 'id', editable: 'never' },
      { title: 'Agent Id', field: 'agentId', editable: 'never' },
      { title: 'Status', field: 'status', editable: 'never' },
      {
        title: 'Created At',
        field: 'createdAt',
        editable: 'never',
        render: (agent) =>
          moment(parseInt(agent.createdAt)).format('MM-DD-YYYY hh:mm A'),
      },
      {
        title: 'Agent Data',
        field: 'agentData',
        render: (agent) => (
          <IconButton
            onClick={() =>
              downloadJson(agent.agentData, agent.agentId, agent.id)
            }>
            <GetAppIcon />
          </IconButton>
        ),
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
    <TableContainer
      className={containerClassName}
      component={Paper}
      aria-label="Published Agents">
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
  );
}

export default PublishedAgentsTable;
