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
import { IExample, IIntent } from '../../../models/chatbot-service';
import { usePrevious } from '../../../utils/hooks';
import { EXAMPLES_LIMIT } from './Examples';
import { ExamplesFilter } from './types';
import { getMargeIntentData } from './utils';

const initialColumns: Column<any>[] = [
  {
    title: 'Intent',
    field: 'intentName',
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
            tag: tag.tagType.value,
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
  loading: boolean;
  examples?: IExample[];
  intents?: IIntent[];
  filters?: ExamplesFilter;
  onDelete: (exampleID: number) => Promise<void>;
  onEdit: (exampleID: number) => void;
  onAdd: () => void;
  updateFilters: (filters: ExamplesFilter) => void;
};

const ExamplesTable = (props: ExamplesTableProps) => {
  const { examples, intents, onDelete, onEdit, onAdd, filters, loading, updateFilters } = props;
  const classes = useStyles();
  const [columns, setColumns] = useState<Column<any>[]>(initialColumns);
  const [data, setData] = useState<any[] | null>(null);
  const [intent, setIntent] = useState<IIntent | null>(intents?.find(i => i.id === filters?.intentId) ?? null);

  const prevIntent = usePrevious(intent);

  useEffect(() => {
    if (prevIntent?.id !== intent?.id) {
      updateFilters({
        intentId: intent?.id,
      });
    }
  // eslint-disable-next-line
  }, [intent]);

  useEffect(() => {
    if (examples && intents) {
      const updatedColumns = [...columns];
      updatedColumns[0] = {
        ...updatedColumns[0],
        filterComponent: (...args) => (
          <Autocomplete
            id="intentSelector"
            options={intents}
            getOptionLabel={(option: any) => option.value}
            value={intent}
            onChange={(e, intent) => {
              setIntent(intent);
            }}
            style={{ maxWidth: 300 }}
            renderInput={(params) => <TextField {...params} label="Intents" variant="outlined" />}
          />
        ),
      };

      setColumns(updatedColumns);
      setData(getMargeIntentData(examples, intents));
    }
    // eslint-disable-next-line
  }, [examples, intents]);

  return (
    <Paper className={classes.paper}>
      <p className={classes.label}>NLU Example Tables</p>
      <TableContainer component={Paper} aria-label="Examples">
        <MaterialTable
          title={
            <Button disabled={loading} variant="contained" color="primary" onClick={onAdd}>Add New Example</Button>
          }
          columns={columns}
          data={data ? _.cloneDeep(data) : []}
          isLoading={loading}
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
                    intentId: intent?.id,
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
