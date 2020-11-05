import {
  Box,
  Button,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  TableContainer,
  Theme,
  Typography,
} from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import React, { useMemo, useState } from 'react';
import { TextAnnotator } from 'react-text-annotate';
import { CommonTable, DropDown } from '../../../components';
import { AlignmentType } from '../../../components/types';
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
    paper: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderRadius: `4px`,
      position: `relative`,
      width: '100%',
    },
    panel: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  }),
);

interface ExamplesTableProps {
  examples: INLUExample[];
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
  intents,
  onAdd,
  onEdit,
  onDelete,
}: ExamplesTableProps) => {
  const classes = useStyles();

  const [intent, setIntent] = useState('');
  const filteredExamples = useMemo(() => {
    return examples.filter((item) => item.intent.toLowerCase().includes(intent));
  }, [intent, examples]);

  const handleIntentChange = (intent: string) => {
    setIntent(intent);
  };

  const renderIntentHeader = () => (
    <Box
      style={{
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'stretch',
      }}
    >
      <Typography variant="subtitle1" style={{fontWeight: 'bold', marginRight: 10}}>
        Intent
      </Typography>
      <DropDown
        label=""
        width={200}
        current={intents.find((each) => each === intent)}
        menuItems={intents}
        onChange={handleIntentChange}
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

  const renderActions = (example: INLUExample) => (
    <>
      <Button onClick={() => onEdit(example)}>
        <Edit />
      </Button>
      <Button onClick={() => onDelete(example)}>
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
      alignRow: 'right' as AlignmentType,
      renderRow: renderActions,
    },
  ];

  return (
    <Paper className={classes.paper}>
      <Grid>
        <Grid className={classes.panel}>
          <Button variant="contained" color="primary" onClick={onAdd}>
            Add New Exampels
          </Button>
        </Grid>
        <Grid>
          <TableContainer
            component={Paper}
            aria-label="Agents"
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
