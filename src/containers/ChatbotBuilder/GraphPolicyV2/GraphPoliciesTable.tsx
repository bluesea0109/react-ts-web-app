import { GraphPolicy } from '@bavard/agent-config';
import { Chip, Paper, TableContainer, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AccountTreeRounded, Delete, GetApp, Power } from '@material-ui/icons';
import 'firebase/auth';
import _ from 'lodash';
import MaterialTable, { Column } from 'material-table';
import React, { useEffect } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      width: '100%',
    },
  }),
);

interface GraphPolicyState {
  columns: Column<GraphPolicy>[];
  data: GraphPolicy[] | undefined;
}

interface GraphPoliciesTableProps {
  policies: GraphPolicy[] | undefined;
  loading?: boolean;
  activePolicyName?: string;
  onDelete: (name: string) => void;
  onActivate: (name: string) => void;
  onEdit?: (name: string) => void;
  onView?: (name: string) => void;
  onExport?: (name: string) => void;
  toolbarChildren?: any;
}

function GraphPoliciesTable({
  policies,
  loading,
  toolbarChildren,
  activePolicyName,
  onView,
  onActivate,
  onDelete,
  onExport,
}: GraphPoliciesTableProps) {
  const classes = useStyles();

  const [state, setState] = React.useState<GraphPolicyState>({
    columns: [
      {
        title: 'Name',
        field: 'policyName',
        editable: 'never',
      },
      {
        title: 'Status',
        field: 'isActive',
        editable: 'never',
        render: (rowData) => {
          return (
            <div>
              {rowData.policyName === activePolicyName ? (
                <Chip label="Active" />
              ) : (
                <span />
              )}
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
              const data = rowData as GraphPolicy;
              onView?.(data.policyName);
            },
          },
          {
            icon: (props: any) => <Power />,
            tooltip: 'Activate',
            onClick: (event, rowData) => {
              const data = rowData as GraphPolicy;
              onActivate(data.policyName);
            },
          },
          {
            icon: (props: any) => <Delete />,
            tooltip: 'Delete',
            onClick: (event, rowData) => {
              const data = rowData as GraphPolicy;
              onDelete(data.policyName);
            },
          },
          {
            icon: (props: any) => <GetApp />,
            tooltip: 'Export',
            onClick: (event, rowData) => {
              const data = rowData as GraphPolicy;
              onExport?.(data.policyName);
            },
          },
        ]}
      />
    </TableContainer>
  );
}

export default GraphPoliciesTable;
