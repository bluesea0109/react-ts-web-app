import {
  Button,
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
import React, { useEffect, useState } from 'react';
import { TextAnnotator } from 'react-text-annotate';
import { INLUExample } from '../../../models/chatbot-service';
import { usePrevious } from '../../../utils/hooks';
import { EXAMPLES_LIMIT } from './Examples';

export interface ExamplesFilter {
  intent?: string;
  offset?: number;
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
    render: data => {
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
          getSpan={span => ({
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
  }),
);

type ExamplesTableProps = {
  examples: INLUExample[];
  intents: string[];
  filters?: ExamplesFilter;
  onDelete: (exampleId: number) => Promise<void>;
  onEdit: (exampleId: number) => void;
  onAdd: () => void;
  updateFilters: (filters: ExamplesFilter) => void;
};

const ExamplesTable = (props: ExamplesTableProps) => {
  const { examples, intents, onDelete, onEdit, onAdd, filters, updateFilters } = props;
  const classes = useStyles();
  const [columns, setColumns] = useState<Column<any>[]>(initialColumns);
  const [data, setData] = useState<any[] | null>(null);
  const [intent, setIntent] = useState<string | undefined>(intents.find(x => x === filters?.intent));

  const prevIntent = usePrevious(intent);

  useEffect(() => {
    if (intent && prevIntent !== intent) {
      updateFilters({
        intent,
      });
    }
  // eslint-disable-next-line
  }, [intent]);

  console.log('auto complete intents', intents);

  useEffect(() => {
    if (examples && intents) {
      const updatedColumns = [...columns];
      updatedColumns[0] = {
        ...updatedColumns[0],
        filterComponent: (...args) => (
          <Autocomplete
            id="intentSelector"
            options={intents}
            value={intent}
            onChange={(e, intent) => {
              setIntent(intent || undefined);
            }}
            style={{ maxWidth: 300 }}
            renderInput={(params) => <TextField {...params} label="Intents" variant="outlined" />}
          />
        ),
      };

      setColumns(updatedColumns);
      setData(examples);
    }
    // eslint-disable-next-line
  }, [examples, intents]);

  return (
    <Paper className={classes.paper}>
      <p className={classes.label}>NLU Examples Table</p>
      <TableContainer component={Paper} aria-label="Examples">
        <MaterialTable
          title={
            <Button variant="contained" color="primary" onClick={onAdd}>Add New Examples</Button>
          }
          columns={columns}
          data={data ? _.cloneDeep(data) : []}
          localization={{
            body: {
              emptyDataSourceMessage: 'No Examples Found. Create Your First Example Now!',
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
            Pagination: props => (
              <TablePagination
                rowsPerPageOptions={[10]}
                rowsPerPage={10}
                count={(data?.length ?? 0) < 10 ? (data?.length ?? 0) : -1}
                labelDisplayedRows={({ from, to, count }) => {
                  return `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`;
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
