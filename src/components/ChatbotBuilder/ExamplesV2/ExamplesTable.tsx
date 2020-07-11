import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Paper, TableContainer, Theme, Typography } from '@material-ui/core';
import MaterialTable, { Column } from 'material-table';
import { MergedExample } from './types';
import { getMargeIntentData, intentsArrToObj } from './utils';
import { IExample, IIntent } from '../../../models/chatbot-service';
import { TextAnnotator } from 'react-text-annotate';
import { Edit } from '@material-ui/icons';

const initialColumns: Column<any>[] = [
  {
    title: 'Intent',
    field: 'intentId',
    editable: 'never',
    customFilterAndSearch: (term: string, rowData: MergedExample) => {
      if (term.length > 0) {
        return Number(term[0]) === rowData.intentId;
      } else {
        return true;
      }
    },
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
            tag: tag.tagType.value
          }
        }),
        tag: data.tags[0].tagType.value
      }

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
      )
    }
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
  examples?: IExample[];
  intents?: IIntent[];
  onDelete: (exampleID: number) => Promise<void>;
  onEdit: (exampleID: number) => void;
}

const ExamplesTable = ({ examples, intents, onDelete, onEdit }: ExamplesTableProps) => {
  const classes = useStyles();
  const [columns, setColumns] = useState<Column<any>[]>(initialColumns);
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    if (examples && intents) {
      const updatedColumns = [...columns];
      updatedColumns[0].lookup = intentsArrToObj(intents);

      setColumns(updatedColumns);
      setData(getMargeIntentData(examples, intents));
    }
    //eslint-disable-next-line
  }, [examples, intents]);

  return (
    <Paper className={classes.paper}>
      <p className={classes.label}>NLU Example Tables</p>
      {(data && data.length) ? (
        <TableContainer component={Paper} aria-label="Examples">
          <MaterialTable
            title="Examples Table"
            columns={columns}
            data={data}
            options={{
              actionsColumnIndex: -1,
              filtering: true
            }}

            localization={{
              body: {
                editRow: {
                  deleteText: 'Are you sure delete this Example?',
                },
              },
            }}

            editable={{
              onRowDelete: async (oldData) => await onDelete(oldData.id),
            }}

            actions={[
              {
                icon: (props: any) => <Edit />,
                tooltip: "Edit Example",
                onClick: (event, rowData) => {
                  onEdit(rowData.id)
                }
              }
            ]}
          />
        </TableContainer>
      ) : (
        <Typography align="center" variant="h6">
          {'No Examples found'}
        </Typography>
      )}
    </Paper>
  );
};

export default ExamplesTable;