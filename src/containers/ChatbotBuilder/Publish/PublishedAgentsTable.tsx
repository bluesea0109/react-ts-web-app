import {
  Chip,
  IconButton,
  Paper,
  TableContainer,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import GetAppIcon from '@material-ui/icons/GetApp';
import _ from 'lodash';
import MaterialTable, { Column, MTableToolbar } from 'material-table';
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
      width: 'fit-content',
      display: 'inline-block',
    },
    statusChip: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
      textTransform: 'capitalize',
    },
    statusChipReady: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.primary.contrastText,
      textTransform: 'capitalize',
    },
    toolbarContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px 16px',
    },
    toolbar: {
      display: 'inline-block',
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
      { title: 'Version ID', field: 'id', editable: 'never' },
      { title: 'Agent ID', field: 'agentId', editable: 'never' },
      {
        title: 'Status',
        field: 'status',
        editable: 'never',
        render: (agent) => (
          <Chip
            className={
              agent.status === 'READY'
                ? classes.statusChipReady
                : classes.statusChip
            }
            label={agent.status.toLowerCase()}
          />
        ),
      },
      {
        title: 'Creation Date & Time',
        field: 'createdAt',
        editable: 'never',
        render: (agent) =>
          moment(parseInt(agent.createdAt)).format('MM-DD-YYYY hh:mm A'),
      },
      {
        title: 'Download Data',
        field: 'config',
        render: (agent) => (
          <IconButton
            onClick={() => downloadJson(agent.config, agent.agentId, agent.id)}>
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
        title=""
        columns={state.columns}
        data={_.cloneDeep(state.data) || []}
        components={{
          Toolbar: (props) => (
            <div className={classes.toolbarContainer}>
              <div>
                <Typography
                  variant="h6"
                  component="div"
                  className={classes.title}>
                  Published Assistants
                </Typography>
                <div className={classes.toolbar}>
                  <MTableToolbar {...props} />
                </div>
              </div>
              <div>{toolbarChildren}</div>
            </div>
          ),
        }}
        options={{
          searchFieldAlignment: 'left',
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
