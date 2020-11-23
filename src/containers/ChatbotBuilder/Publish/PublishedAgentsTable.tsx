import { CommonTable, StatusChip } from '@bavard/react-components';
import { Box, IconButton, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import GetAppIcon from '@material-ui/icons/GetApp';
import moment from 'moment';
import React, { useMemo } from 'react';
import { IPublishedAgent } from '../../../models/chatbot-service';
import { exportJsonFileFromObj } from '../../../utils/exports';
import { removeSpecialChars } from '../../../utils/string';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
    },
    title: {
      width: 'fit-content',
      display: 'inline-block',
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

  const downloadJson = (data: any, agentId: number, version: number) => {
    exportJsonFileFromObj(data, `agent_${agentId}_v${version}.json`);
  };

  const columns = useMemo(() => {
    return [
      { title: 'Version ID', field: 'id' },
      { title: 'Agent ID', field: 'agentId' },
      {
        title: 'Status',
        field: 'status',
        renderRow: (agent: IPublishedAgent) => (
          <StatusChip
            color={agent.status === 'READY' ? 'green' : 'blue'}
            text={removeSpecialChars(agent.status.toLowerCase())}
          />
        ),
      },
      {
        title: 'Creation Date & Time',
        field: 'createdAt',
        renderRow: (agent: IPublishedAgent) =>
          moment(parseInt(agent.createdAt)).format('MM-DD-YYYY hh:mm A'),
      },
      {
        title: 'Download Data',
        field: 'config',
        renderRow: (agent: IPublishedAgent) => (
          <IconButton
            onClick={() => downloadJson(agent.config, agent.agentId, agent.id)}>
            <GetAppIcon />
          </IconButton>
        ),
      },
    ];
  }, []);

  return (
    <CommonTable
      data={{
        columns,
        rowsData: publishedAgents,
      }}
      pagination={{
        rowsPerPage: 10,
      }}
      components={{
        Toolbar: () => (
          <Box className={classes.toolbarContainer}>
            <Box>
              <Typography
                variant="h6"
                component="div"
                className={classes.title}>
                Published Assistants
              </Typography>
            </Box>
            <Box>{toolbarChildren}</Box>
          </Box>
        ),
      }}
    />
  );
}

export default PublishedAgentsTable;
