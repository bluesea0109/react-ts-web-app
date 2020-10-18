import {
  createStyles,
  makeStyles,
  Paper,
  TableContainer,
  TablePagination,
  TextField,
  Theme,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import _ from 'lodash';
import MaterialTable, { Column } from 'material-table';
import React, { useState } from 'react';
import { TextAnnotator } from 'react-text-annotate';
import { INLUExample } from '../../../models/chatbot-service';
import { EXAMPLES_LIMIT } from './Examples';

export interface ExamplesFilter {
  intent?: string;
  offset?: number;
}

export interface InvalidExist {
  invalidExist?: boolean;
}

const initialColumns: Column<any>[] = [
  {
    title: 'Intent',
    field: 'intent',
    editable: 'never',
    filtering: true,
  },
  {
    title: 'Text',
    field: 'text',
    editable: 'never',
    filtering: false,
    render: (data) => {
      const state = {
        value: data.tags.map((tag: any) => {
          return {
            start: tag.start,
            end: tag.end,
            tag: tag.tagType,
          };
        }),
        tag: null,
      };

      return (
        <TextAnnotator
          style={{
            maxWidth: 500,
            lineHeight: 1.5,
          }}
          content={data.text}
          value={state.value}
          onChange={console.log}
          getSpan={(span) => ({
            ...span,
            tag: state.tag,
            color: '#ccc',
          })}
        />
      );
    },
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(2),
      border: `1px solid #000`,
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
  const {
    examples,
    intents,
    onDelete,
    onEdit,
    filters,
    updateFilters,
  } = props;

  const classes = useStyles();

  const [intent, setIntent] = useState<string | undefined>(
    intents.find((x) => x === filters?.intent),
  );

  const onIntentFilterChanged = (intent?: string) => {
    setIntent(intent);
    updateFilters({
      intent,
    });
  };

  console.log('examples', examples);
  console.log('intents', examples);

  let columns = initialColumns;
  if (examples && intents) {
    columns = [...columns];
    columns[0] = {
      ...columns[0],
      filterComponent: (...args) => (
        <Autocomplete
          id="intentSelector"
          options={intents}
          value={intent}
          onChange={(e, intent) => {
            onIntentFilterChanged(intent || undefined);
          }}
          style={{ maxWidth: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Intents" variant="outlined" />
          )}
        />
      ),
    };
  }

  return (
    <Paper className={classes.paper}>
      <p className={classes.label}>NLU Examples Table</p>
      <TableContainer component={Paper} aria-label="Examples">
        <MaterialTable
          columns={columns}
          data={examples ? _.cloneDeep(examples) : []}
          localization={{
            body: {
              emptyDataSourceMessage:
                'No Examples Found. Create Your First Example Now!',
            },
          }}
          options={{
            actionsColumnIndex: -1,
            filtering: true,
            search: false,
            paging: true,
            pageSize: 10,
          }}
          editable={{
            onRowDelete: async (oldData) => await onDelete(oldData.id),
          }}
          actions={[
            {
              icon: (props: any) => <Edit />,
              tooltip: 'Edit Example',
              onClick: (event, rowData) => {
                onEdit(rowData.id);
              },
            },
          ]}
          components={{
            Pagination: (props) => (
              <TablePagination
                rowsPerPageOptions={[10]}
                rowsPerPage={10}
                count={examples?.length ?? 0 >= 10 ? -1 : examples?.length ?? 0}
                labelDisplayedRows={({ from, to, count }) => {
                  return `${from}-${to} of ${
                    count !== -1 ? count : `more than ${to}`
                  }`;
                }}
                page={(filters?.offset ?? 0) / EXAMPLES_LIMIT}
                onChangePage={(e, page) =>
                  updateFilters({
                    intent: intent || undefined,
                    offset: page * EXAMPLES_LIMIT,
                  })
                }
              />
            ),
          }}
        />
      </TableContainer>
    </Paper>
  );
};

export default ExamplesTable;
