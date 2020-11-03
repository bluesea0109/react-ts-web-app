import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  TableContainer,
  Theme,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Delete, Edit } from '@material-ui/icons';
import _ from 'lodash';
import React, { useState } from 'react';
import { TextAnnotator } from 'react-text-annotate';
import { DropDown } from '../../../components';
import { INLUExample } from '../../../models/chatbot-service';

export interface ExamplesFilter {
  intent?: string;
  offset?: number;
}

export interface InvalidExist {
  invalidExist?: boolean;
}

const renderText = (data: INLUExample) => {
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
      onChange={() => {}}
      getSpan={(span) => ({
        ...span,
        tag: state.tag,
        color: '#ccc',
      })}
    />
  );
};

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

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: 'wihte',
  },
  body: {
    padding: '5px',
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const ExamplesTable = (props: ExamplesTableProps) => {
  const { examples, intents } = props;

  const classes = useStyles();

  const [filter, setFilter] = useState('');
  const filteredExamples = examples.filter((item) =>
    item.intent.toLowerCase().includes(filter),
  );
  console.log('Fitlered examples ', filteredExamples);
  console.log('fitler ', filter);

  const handleEdit = (row: INLUExample) => {
    console.log(row);
  };

  const deleteExampleHandler = (row: INLUExample) => {
    console.log(row);
  };

  const handleChange = (field: string) => {
    console.log('EHS');
    setFilter(field);
  };

  const onAdd = () => {
    console.log('Adding ');
  };

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
            className={classes.table}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    <div className={classes.headerName}>
                      <div style={{ marginRight: '20px', fontWeight: 'bold' }}>
                        Intent
                      </div>
                      <div>
                        <DropDown
                          label=""
                          current={intents.find((intent) => intent === filter)}
                          menuItems={intents}
                          onChange={handleChange}
                          size="small"
                        />
                      </div>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="left" style={{ fontWeight: 'bold' }}>
                    Text
                  </StyledTableCell>
                  <StyledTableCell align="right" style={{ fontWeight: 'bold' }}>
                    Action
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.cloneDeep(filteredExamples).map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.intent}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {renderText(row)}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="right">
                      <Button onClick={() => handleEdit(row)}>
                        <Edit />
                      </Button>
                      <Button onClick={() => deleteExampleHandler(row)}>
                        <Delete />
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ExamplesTable;
