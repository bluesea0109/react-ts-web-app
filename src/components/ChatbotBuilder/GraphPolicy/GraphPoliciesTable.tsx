import {
  Chip,
  Paper,
  TableContainer,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AccountTreeRounded, Delete, Power } from '@material-ui/icons';
import 'firebase/auth';
import _ from 'lodash';
import MaterialTable, { Column } from 'material-table';
import React, { useEffect } from 'react';
import { IAgentGraphPolicy } from '../../../models/chatbot-service';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(2),
    },
    title: {
      width: '100%',
    },
  }),
);

interface GraphPolicyState {
  columns: Column<IAgentGraphPolicy>[];
  data: IAgentGraphPolicy[] | undefined;
}

interface GraphPoliciesTableProps {
  policies: IAgentGraphPolicy[] | undefined;
  loading?: boolean;
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
  onEdit?: (id: number) => void;
  onView?: (graph: IAgentGraphPolicy) => void;
  toolbarChildren?: any;
}

function GraphPoliciesTable({ policies , loading, toolbarChildren, onEdit, onView, onActivate, onDelete }: GraphPoliciesTableProps) {
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
      <TableContainer component={Paper} aria-label="Graph Policies">
        <MaterialTable
          isLoading={loading}
          title={
            <Typography variant="h6" className={classes.title}>
              Graph Policies {toolbarChildren}
            </Typography>
          }
          columns={state.columns}
          data={_.cloneDeep(state.data) || []}
          options={{
            actionsColumnIndex: -1,
            search: true,
            paging: true,
            pageSize: 10,
          }}
          actions={[
            {
              icon: (props: any) => <AccountTreeRounded />,
              tooltip: 'View Graph',
              onClick: (event, rowData) => {
                const data = rowData as IAgentGraphPolicy;
                onView?.(data);
              },
            },
            {
              icon: (props: any) => <Power />,
              tooltip: 'Activate',
              onClick: (event, rowData) => {
                const data = rowData as IAgentGraphPolicy;
                onActivate(data.id);
              },
            },
            {
              icon: (props: any) => <Delete />,
              tooltip: 'Delete',
              onClick: (event, rowData) => {
                const data = rowData as IAgentGraphPolicy;
                onDelete(data.id);
              },
            },
          ]}
        />
      </TableContainer>
    </Paper>
  );
}

export default GraphPoliciesTable;
