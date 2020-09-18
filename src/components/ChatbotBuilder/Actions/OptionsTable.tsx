import { IResponseOption } from '@bavard/agent-config';
import {
  Box,
  Button, Grid,
  Paper,
  TableContainer, Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Edit } from '@material-ui/icons';
import _ from 'lodash';
import MaterialTable, { Column } from 'material-table';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(2),
    },
  }),
);

interface OptionsTableProps {
  options: IResponseOption[];
  onAdd: () => void;
  onEditOption: (option: IResponseOption) => void;
  onDeleteOption: (option: IResponseOption) => void | Promise<void>;
}

function OptionsTable({
  options,
  onAdd,
  onEditOption,
  onDeleteOption,
}: OptionsTableProps) {
  const classes = useStyles();
  const columns: Column<IResponseOption>[] = [
    { title: 'Type', field: 'type', editable: 'never' },
    { title: 'Text', field: 'text', editable: 'never' },
  ];

  return (
    <Paper className={classes.paper}>
      <TableContainer component={Paper} aria-label="Options">
        <MaterialTable
          title={
            <Button variant="contained" color="primary" onClick={onAdd}>Add New Option</Button>
          }
          columns={columns}
          data={_.cloneDeep(options)}
          detailPanel={({ tableData, ...optionDetails }: any) => <OptionDetailsPanel option={optionDetails}/>}
          options={{
            actionsColumnIndex: -1,
            paging: true,
            pageSize: 10,
          }}
          localization={{
            body: {
              editRow: {
                deleteText: 'Are you sure delete this Option?',
              },
            },
          }}
          actions={[
            {
              icon: (_: any) => <Edit/>,
              tooltip: 'Edit Option',
              onClick: (_, rowData) => onEditOption(rowData as IResponseOption),
            },
          ]}
          editable={{
            onRowDelete: async (data) => onDeleteOption(data),
          }}
        />
      </TableContainer>
    </Paper>
  );
}

type OtherProps = { [index: string]: any };

const OptionDetailsPanel = ({ option }: { option: IResponseOption }) => {
  const { intent, type, ...otherProps } = option;
  const optionProps = otherProps as OtherProps;

  return (
    <Grid container={true}>
        {Array.from(Object.keys(optionProps)).map((key, index) => key === 'imageUrl' ? (
          <Grid key={index} item={true}>
            <Box my={3} p={2} key={key}>
              <Typography variant="h6" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>Image</Typography>
              <Box>
                <img src={optionProps[key]} alt="" style={{ maxWidth: 400, maxHeight: 400, objectFit: 'contain' }} />
              </Box>
            </Box>
          </Grid>
          ) : (
          <Grid key={index} item={true}>
            <Box my={3} p={2} key={key}>
              <Typography variant="h6" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{key}</Typography>
              <Typography variant="caption" style={{ textTransform: 'capitalize' }}>{optionProps[key]}</Typography>
            </Box>
          </Grid>
        ))}
    </Grid>
  );
};

export default OptionsTable;
