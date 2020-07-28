import {
  Box, Button,
  Grid,
  Paper,
  TableContainer,
  Typography,
  Fab,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Edit } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import 'firebase/auth';
import MaterialTable, { Column } from 'material-table';
import React, { useEffect } from 'react';
import { AnyAction } from '../../models/chatbot-service';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(2),
    },
    addButton: {
      position: "absolute",
      bottom: theme.spacing(3),
      right: theme.spacing(3),
    }
  }),
);

interface ActionState {
  columns: Column<AnyAction>[];
  data: AnyAction[] | undefined;
}

interface GraphPoliciesTableProps {
  policies: any[];
  loading?: boolean;
  onAdd?: () => void;
  onEdit?: (id: number) => void;
}

function GraphPoliciesTable({ policies, loading=false, onAdd, onEdit }: GraphPoliciesTableProps) {
  const classes = useStyles();

  const [state, setState] = React.useState<ActionState>({
    columns: [
      { title: 'Policy Id', field: 'id', editable: 'never' },
      {
        title: 'Name',
        field: 'name',
        editable: 'never',
      },
      // {
      //   title: 'Assigned To Agents',
      //   field: 'assignedAgents',
      //   editable: 'never',
      // },
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
              "Graph Policies"
            }
            columns={state.columns}
            data={state.data}
            detailPanel={({ tableData, ...actionDetails }: any) => <ActionDetailPanel action={actionDetails} />}
            options={{
              actionsColumnIndex: -1,
              filtering: true,
              search: false,
              paging: true,
              pageSize: 10,
            }}
            actions={[
              {
                icon: (props: any) => <Edit />,
                tooltip: 'Edit',
                onClick: (event, rowData) => {
                  const data = rowData as AnyAction;
                  if((onEdit)) {
                    onEdit(data.id);
                  }
                },
              },
            ]}
          />
          <Fab color="primary" aria-label="add" onClick={onAdd} className={classes.addButton}>
            <AddIcon />
          </Fab>
        </TableContainer>
      ) : (
        <Typography align="center" variant="h6">
          {'No Graph Policies Found'}
        </Typography>
      )}
    </Paper>
  );
}

type OtherProps = { [index: string]: any };

const ActionDetailPanel = ({ action }: { action: AnyAction }) => {
    const { id, type, name, agentId, ...otherProps } = action;
    const actionProps = otherProps as OtherProps;

    return (
      <Grid container={true}>
        <Grid item={true} xs={6}>
          {Array.from(Object.keys(actionProps)).map(key => (
            <Box my={3} key={key}>
              <Typography variant="h6" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{key}</Typography>
              <Typography variant="caption" style={{ textTransform: 'capitalize' }}>{actionProps[key]}</Typography>
            </Box>
          ))}
        </Grid>
      </Grid>
    );
};

export default GraphPoliciesTable;
