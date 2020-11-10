import { BaseAgentAction, IIntent } from '@bavard/agent-config';
import { Box, Paper, TableContainer, Typography } from '@material-ui/core';
import 'firebase/auth';
import React, { useState } from 'react';
import { BasicButton, CommonTable, FilterBox } from '../../../components';

interface IntentsTableProps {
  intents: IIntent[];
  actions: BaseAgentAction[];
  onAdd: () => void;
  onEditIntent: (intent: IIntent) => void;
  onDeleteIntent: (intent: IIntent) => void;
}

function IntentsTable({
  intents,
  onAdd,
  onEditIntent,
  onDeleteIntent,
}: IntentsTableProps) {
  const [filter, setFilter] = useState<string>('');

  const filteredIntents = intents.filter((item) =>
    item.name.toLowerCase().includes(filter.toLocaleLowerCase()),
  );

  const renderIntentName = () => (
    <Box
      style={{
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'stretch',
      }}>
      <FilterBox name="Intent Name" filter={filter} onChange={setFilter} />
    </Box>
  );

  const columns = [
    {
      title: 'Name',
      field: 'name',
      renderHeader: renderIntentName,
    },
    {
      title: 'Default Action',
      field: 'defaultActionName',
      renderRow: (intent: IIntent) =>
        intent.defaultActionName || (
          <Typography style={{ color: '#808080' }}>N/A</Typography>
        ),
    },
  ];

  return (
    <TableContainer component={Paper} aria-label="Intents">
      <CommonTable
        data={{
          columns,
          rowsData: filteredIntents,
        }}
        pagination={{
          colSpan: 3,
          rowsPerPage: 10,
        }}
        localization={{
          actionsText: '',
        }}
        components={{
          Toolbar: () => (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              paddingX={3}
              paddingY={2}>
              <Box flex="1">
                <Typography variant="h6">Intents</Typography>
                <Typography>
                  Edit an Intent below to add examples of user queries. Add
                  several examples to ensure that your Assistant will respond
                  accurately.
                </Typography>
              </Box>
              <Box flex="1" textAlign="right">
                <BasicButton
                  color="primary"
                  variant="contained"
                  title="Add New Intent"
                  onClick={onAdd}
                />
              </Box>
            </Box>
          ),
        }}
        editable={{
          isEditable: true,
          isDeleteable: true,
          onRowUpdate: (rowData: IIntent) => onEditIntent(rowData),
          onRowDelete: onDeleteIntent,
        }}
      />
    </TableContainer>
  );
}

export default IntentsTable;
