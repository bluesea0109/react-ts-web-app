import {
  Box,
  Button,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useMemo } from 'react';
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
    panel: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: theme.spacing(3),
    },
  }),
);

interface ExamplesTableProps {
  examples: INLUExample[];
  exampleCount: number;
  examplesPerPage: number;
  intents: string[];
  filters?: ExamplesFilter;
  config: any;
  onDelete: (example: INLUExample) => Promise<void>;
  onEdit: (example: INLUExample) => void;
  onAdd: () => void;
  updateFilters: (filters: ExamplesFilter) => void;
  onUpdateExample: (updatedExample: INLUExample) => Promise<void>;
}

const ExamplesTable = ({
  examples,
  exampleCount,
  examplesPerPage,
  intents,
  filters,
  updateFilters,
  onAdd,
  onEdit,
  onDelete,
}: ExamplesTableProps) => {
  const classes = useStyles();

  const filteredExamples = useMemo(() => {
    if (!filters || !filters.intent) {
      return examples;
    }
    return examples.filter((item) =>
      item.intent.toLowerCase().includes(filters?.intent || ''),
    );
  }, [filters, examples]);

  const handlePageChange = (page: number) => {
    updateFilters({ offset: page * examplesPerPage });
  };

  const columns = [
    {
      title: 'Natural Language Examples',
      field: 'intent',
      renderRow: (data: INLUExample) => (
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
      ),
    },
    {
      title: 'Selected Tag Type',
      field: 'text',
      renderRow: (data: INLUExample) =>
        data.tags.map((tag) => tag.tagType).join(', '),
    },
  ];

  return (
    <CommonTable
      data={{
        columns,
        rowsData: filteredExamples,
      }}
      pagination={{
        colSpan: 3,
        isAsync: true,
        asyncPage: Math.floor((filters?.offset || 0) / examplesPerPage),
        rowsPerPage: examplesPerPage,
        asyncTotalCount: exampleCount,
        onUpdatePage: handlePageChange,
      }}
      editable={{
        isEditable: true,
        isDeleteable: true,
        onRowDelete: (example) => onDelete(example),
        onRowUpdate: (example) => onEdit(example),
      }}
      localization={{
        actionsText: '',
      }}
      components={{
        TableFooter: () => (
          <Button variant="contained" color="primary" onClick={onAdd}>
            Add New Examples
          </Button>
        ),
      }}
    />
  );
};

export default ExamplesTable;
