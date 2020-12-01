import { CommonTable, Button } from '@bavard/react-components';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import React, { useMemo } from 'react';
import randomcolor from 'randomcolor';
import { TextAnnotator } from 'react-text-annotate';
import { INLUExample } from '../../../models/chatbot-service';

export interface ExamplesFilter {
  intent?: string;
  offset?: number;
}

export interface InvalidExist {
  invalidExist?: boolean;
}

interface ExamplesTableProps {
  examples: INLUExample[];
  exampleCount: number;
  examplesPerPage: number;
  filters?: ExamplesFilter;
  config: any;
  tagTypes: string[];
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
  tagTypes,
  filters,
  updateFilters,
  onAdd,
  onEdit,
  onDelete,
}: ExamplesTableProps) => {
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

  const randColors = randomcolor({
    luminosity: 'light',
    count: tagTypes.length,
  });

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
            // prettier-ignore
            color: randColors[tagTypes.findIndex(tagType => tagType === tag.tagType)],
          }))}
          onChange={() => {}}
          getSpan={(span: any) => ({
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
        data.tags.map((tag, index) => (
          <span
            key={index}
            style={{
              margin: '2px',
              // prettier-ignore
              backgroundColor: randColors[tagTypes.findIndex((tagType) => tagType === tag.tagType)],
            }}>
            {tag.tagType}
          </span>
        )),
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
        onRowEdit: (example) => onEdit(example),
      }}
      localization={{
        actionsText: '',
      }}
      components={{
        TableFooter: () => (
          <Button
            color="primary"
            title="Add New Example"
            variant="text"
            iconPosition="left"
            onClick={onAdd}
            Icon={AddCircleOutline}
          />
        ),
      }}
    />
  );
};

export default ExamplesTable;
