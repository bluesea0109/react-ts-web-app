import { GraphPolicyV2 } from '@bavard/agent-config/dist/graph-policy-v2';
import { Box, Chip, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AccountTreeRounded, Delete, GetApp, Power } from '@material-ui/icons';
import 'firebase/auth';
import React, { useMemo } from 'react';
import { CommonTable } from '../../../components';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      width: '100%',
    },
  }),
);

interface GraphPoliciesTableProps {
  policies: GraphPolicyV2[] | undefined;
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

  const columns = useMemo(() => {
    return [
      {
        title: 'Name',
        field: 'name',
      },
      {
        title: 'Status',
        field: 'isActive',
        render: (rowData: GraphPolicyV2) => {
          return (
            <Box>
              {rowData.name === activePolicyName && <Chip label="Active" />}
            </Box>
          );
        },
      },
    ];
  }, [activePolicyName]);

  return (
    <CommonTable
      title={
        <Typography variant="h6" className={classes.title}>
          Graph Policies {toolbarChildren}
        </Typography>
      }
      data={{
        columns,
        rowsData: policies,
      }}
      pagination={{
        rowsPerPage: 10,
      }}
      actions={[
        {
          icon: (props: any) => <AccountTreeRounded />,
          tooltip: 'View Graph',
          onClick: (_, rowData) => onView?.((rowData as GraphPolicyV2).name),
        },
        {
          icon: (props: any) => <Power />,
          tooltip: 'Activate',
          onClick: (event, rowData) =>
            onActivate((rowData as GraphPolicyV2).name),
        },
        {
          icon: (props: any) => <Delete />,
          tooltip: 'Delete',
          onClick: (event, rowData) =>
            onDelete((rowData as GraphPolicyV2).name),
        },
        {
          icon: (props: any) => <GetApp />,
          tooltip: 'Export',
          onClick: (event, rowData) =>
            onExport?.((rowData as GraphPolicyV2).name),
        },
      ]}
    />
  );
}

export default GraphPoliciesTable;
