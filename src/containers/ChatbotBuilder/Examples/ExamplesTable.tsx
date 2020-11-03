import {
  Box,
  Button,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  TableContainer,
  Theme,
} from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import React, { useState } from 'react';
import { TextAnnotator } from 'react-text-annotate';
import { CommonTable, DropDown } from '../../../components';
import { INLUExample } from '../../../models/chatbot-service';

export interface ExamplesFilter {
  intent?: string;
  offset?: number;
}

export interface InvalidExist {
  invalidExist?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderRadius: `4px`,
      position: `relative`,
    },
    selectionText: {
      border: 'none',
      outline: 'none',
      backgroundColor: '#f5f5f5',
    },
    label: {
      position: `absolute`,
      top: `-26px`,
      left: `20px`,
      background: `white`,
      padding: `0px 5px`,
    },
    alert: {
      width: '100%',
      marginTop: '2rem',
      marginBottom: '2rem',
    },
    resolveAction: {
      cursor: 'pointer',
      transitionDuration: '150ms',
      '&:hover': {
        color: 'lightgray',
      },
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
    panel: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  }),
);

type ExamplesTableProps = {
  examples: INLUExample[];
  intents: string[];
  filters?: ExamplesFilter;
  config: any;
  onDelete: (exampleId: number) => Promise<void>;
  onEdit: (exampleId: number) => void;
  onAdd: () => void;
  updateFilters: (filters: ExamplesFilter) => void;
  onUpdateExample: (updatedExample: INLUExample) => Promise<void>;
};

const ExamplesTable = (props: ExamplesTableProps) => {
  const { examples, intents } = props;

  const classes = useStyles();

  const [filter, setFilter] = useState('');
  const filteredExamples = examples.filter((item) =>
    item.intent.toLowerCase().includes(filter),
  );

  const handleEdit = (row: INLUExample) => {
  };

  const deleteExampleHandler = (row: INLUExample) => {
  };

  const handleChange = (field: string) => {
    setFilter(field);
  };

  const onAdd = () => {
  };

  const renderIntentHeader = () => (
    <Box>
      Intent
      <DropDown
        label=""
        current={intents.find((intent) => intent === filter)}
        menuItems={intents}
        onChange={handleChange}
        size="small"
      />
    </Box>
  );

  const renderText = (data: INLUExample) => (
    <TextAnnotator
      style={{
        maxWidth: 500,
        lineHeight: 1.5,
      }}
      content={data.text}
      value={data.tags.map((tag: any) => ({
        start: tag.start,
        end: tag.end,
        tag: tag.tagType,
      }))}
      onChange={() => {}}
      getSpan={(span) => ({
        ...span,
        tag: null,
        color: '#ccc',
      })}
    />
  );

  const renderActions = (row: INLUExample) => (
    <>
      <Button onClick={() => handleEdit(row)}>
        <Edit />
      </Button>
      <Button onClick={() => deleteExampleHandler(row)}>
        <Delete />
      </Button>
    </>
  );

  const columns = [
    {
      title: 'Intent',
      field: 'intent',
      renderHeader: renderIntentHeader,
    },
    {
      title: 'Text',
      field: 'text',
      renderRow: renderText,
    },
    {
      title: '',
      field: '',
      renderRow: renderActions,
    },
  ];

  return (
    <Paper className={classes.paper}>
      <Grid>
        <Grid className={classes.panel}>
          <Button variant="contained" color="primary" onClick={onAdd}>
            Add New Intent
          </Button>
        </Grid>
        <Grid>
          <TableContainer
            component={Paper}
            aria-label="Agents"
            className={classes.table}
          >
            <CommonTable
              data={{
                columns,
                rowsData: filteredExamples,
              }}
              pagination={{
                colSpan: 1,
                rowsPerPage: 10,
              }}
            />
          </TableContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ExamplesTable;
