import { GraphPolicy } from '@bavard/agent-config';
import { Box, Chip, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AccountTreeRounded, Delete, GetApp, Power } from '@material-ui/icons';
import 'firebase/auth';
import React, { useMemo } from 'react';
import { CommonTable } from '../../../components';

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

  const columns = useMemo(() => {
    return [
      {
        title: 'Name',
        field: 'policyName',
      },
      {
        title: 'Status',
        field: 'isActive',
        render: (rowData: GraphPolicy) => {
          return (
            <Box>
              {rowData.policyName === activePolicyName && (
                <Chip label="Active" />
              )}
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
          onClick: (_, rowData) =>
            onView?.((rowData as GraphPolicy).policyName),
        },
        {
          icon: (props: any) => <Power />,
          tooltip: 'Activate',
          onClick: (event, rowData) =>
            onActivate((rowData as GraphPolicy).policyName),
        },
        {
          icon: (props: any) => <Delete />,
          tooltip: 'Delete',
          onClick: (event, rowData) =>
            onDelete((rowData as GraphPolicy).policyName),
        },
        {
          icon: (props: any) => <GetApp />,
          tooltip: 'Export',
          onClick: (event, rowData) =>
            onExport?.((rowData as GraphPolicy).policyName),
        },
      ]}
    />
  );
}

export default GraphPoliciesTable;
