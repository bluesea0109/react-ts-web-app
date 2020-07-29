import {
  Chip,
  Paper,
  TableContainer,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Delete, Power } from '@material-ui/icons';
import 'firebase/auth';
import MaterialTable, { Column } from 'material-table';
import React, { useEffect } from 'react';
import { IGraphPolicy } from '../../../models/chatbot-service';

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

interface GraphPolicyState {
  columns: Column<IGraphPolicy>[];
  data: IGraphPolicy[] | undefined;
}

interface GraphPoliciesTableProps {
  policies: IGraphPolicy[] | undefined;
  loading?: boolean;
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
  onEdit?: (id: number) => void;
}

function GraphPoliciesTable({ policies, loading, onEdit, onActivate, onDelete }: GraphPoliciesTableProps) {
  const classes = useStyles();

  const [state, setState] = React.useState<GraphPolicyState>({
    columns: [
      { title: 'Policy Id', field: 'id', editable: 'never' },
      {
        title: 'Name',
        field: 'name',
        editable: 'never',
      },
      {
        title: 'Status',
        field: 'isActive',
        editable: 'never',
        render: (rowData) => {
          console.log(rowData);
          return (
          <div>
            {
              rowData.isActive
              ?
              <Chip label="Active"/>
              :
              <span/>
            }
          </div>
          );
        },
      },
    ],
    data: policies,
  });

  useEffect(() => {
    if (policies) {
      setState({
        columns: state.columns,
        data: [...policies],
      });
    }

    return () => {};
  }, [policies, state.columns]);

  return (
    <Paper className={classes.paper}>
      {state && state.data && state.data.length > 0 ? (
        <TableContainer component={Paper} aria-label="Graph Policies">
          <MaterialTable
            isLoading={loading}
            title={
              <span>
                Graph Policies
              </span>
            }
            columns={state.columns}
            data={state.data}
            options={{
              actionsColumnIndex: -1,
              filtering: true,
              search: false,
              paging: true,
              pageSize: 10,
            }}
            actions={[
              {
                icon: (props: any) => <Power />,
                tooltip: 'Activate',
                onClick: (event, rowData) => {
                  const data = rowData as IGraphPolicy;
                  onActivate(data.id);
                },
              },
              {
                icon: (props: any) => <Delete />,
                tooltip: 'Delete',
                onClick: (event, rowData) => {
                  const data = rowData as IGraphPolicy;
                  onDelete(data.id);
                },
              },
            ]}
          />
        </TableContainer>
      ) : (
        <Typography align="center" variant="h6">
          {'No Graph Policies Found'}
        </Typography>
      )}
    </Paper>
  );
}

export default GraphPoliciesTable;
