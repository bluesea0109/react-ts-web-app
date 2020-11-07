import { BaseAgentAction, IIntent } from '@bavard/agent-config';
import {
  Box,
  Button,
  Grid,
  Paper,
  TableContainer,
  Typography,
} from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import { Delete, Edit } from '@material-ui/icons';
import 'firebase/auth';
import React, { useState } from 'react';
import { CommonTable, FilterBox } from '../../../components';
import { AlignmentType } from '../../../components/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    table: {
      minWidth: '600px',
      background: 'white',
      width: '100%',
      margin: 'auto',
    },
    headerName: {
      display: 'flex',
      alignItems: 'flex-start',
    },
    intro: {
      display: 'inline-block',
      width: '50%',
    },
    rightLayout: {
      display: 'flex',
      top: '0px',
      float: 'right',
    },
    title: {
      fontSize: '22px',
      marginBottom: '5px',
    },
    desc: {
      fontSize: '15px',
      marginBottom: '10px',
    },
  }),
);

interface IntentsTableProps {
  onEditIntent: (intent: IIntent) => void;
  onDeleteIntent: (intent: IIntent) => void;
  intents: IIntent[];
  actions: BaseAgentAction[];
  onAdd: () => void;
}

function IntentsTable({
  intents,
  actions,
  onAdd,
  onEditIntent,
  onDeleteIntent,
}: IntentsTableProps) {
  const classes = useStyles();

  const [filter, setFilter] = useState<string>('');

  const onDelete = (intent: IIntent) => {
    onDeleteIntent(intent);
  };

  const onEdit = (rowData: IIntent) => {
    const data = rowData as IIntent;
    onEditIntent(data);
  };
  const filteredIntents = intents.filter((item) => item.name.toLowerCase().includes(filter.toLocaleLowerCase()));

  const renderIntentName = () => (
    <FilterBox
      name="Intent Name"
      filter={filter}
      onChange={setFilter}
    />
  );

  const renderActions = (intent: IIntent) => (
    <>
      <Button onClick={() => onEdit(intent)}>
        <Edit />
      </Button>
      <Button onClick={() => onDelete(intent)}>
        <Delete />
      </Button>
    </>
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
      renderRow: (intent: IIntent) => intent.defaultActionName ?? (
        <Typography style={{ color: '#808080' }}>N/A</Typography>
      ),
    },
    {
      title: '',
      field: '',
      alignRow: 'right' as AlignmentType,
      renderRow: renderActions,
    },
  ];

  return (
    <Paper className={classes.root}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        paddingBottom={2}
      >
        <Box>
          <Typography variant="h6">
            Intents
          </Typography>
          <Typography>
            Edit an Intent below to add examples of user queries.
            Add several examples to ensure that your Assistant will respond accurately.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={onAdd}>
          Add New Intent
        </Button>
      </Box>

      <Grid>
        <Typography className={classes.headerName}/>
      </Grid>
      <Grid>
        <TableContainer
          component={Paper}
          aria-label="Intents"
        >
          <CommonTable
            data={{
              columns,
              rowsData: filteredIntents,
            }}
            pagination={{
              colSpan: 1,
              rowsPerPage: 10,
            }}
          />
        </TableContainer>
      </Grid>
    </Paper>
  );
}

export default IntentsTable;
