import { useMutation, useQuery } from '@apollo/client';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';
import TableIcon from '@material-ui/icons/TableChart';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { IDataExport } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    paper: {
      margin: theme.spacing(1),
    },
  }),
);

function DataExportsTable() {
  const rowsPerPage = 10;
  const classes = useStyles();
  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);

  interface IGetDataExports {
    ChatbotService_dataExports: IDataExport[];
  }
  const getExports = useQuery<IGetDataExports>(GET_DATA_EXPORTS, {
    variables: { agentId },
  });
  const [createExport, createExportResult] = useMutation(CREATE_EXPORT, {
    refetchQueries: [
      {
        query: GET_DATA_EXPORTS,
        variables: {
          agentId,
        },
      },
    ],
    awaitRefetchQueries: true,
  });
  const [deleteExport, deleteExportResult] = useMutation(DELETE_EXPORT, {
    refetchQueries: [
      {
        query: GET_DATA_EXPORTS,
        variables: {
          agentId,
        },
      },
    ],
    awaitRefetchQueries: true,
  });

  const [state, setState] = useState({
    loading: false,
    page: 0,
  });

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => {
    setState({ ...state, page });
  };

  const getPage = (exports: IDataExport[]) => {
    const { page } = state;
    return exports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const onExportClick = async (kind: 'JSON' | 'ZIP') => {
    // create export mutation
    createExport({
      variables: {
        agentId,
        kind,
      },
    });
  };

  const onDeleteExportClick = (exportId: number) => async () => {
    deleteExport({
      variables: {
        exportId,
      },
    });
  };

  if (getExports.error) {
    return <ApolloErrorPage error={getExports.error} />;
  }

  if (createExportResult.error) {
    return <ApolloErrorPage error={createExportResult.error} />;
  }

  if (deleteExportResult.error) {
    return <ApolloErrorPage error={deleteExportResult.error} />;
  }

  if (
    getExports.loading ||
    createExportResult.loading ||
    deleteExportResult.loading
  ) {
    return <ContentLoading shrinked={true}/>;
  }

  const exports = getExports.data?.ChatbotService_dataExports ?? [];
  const pageItems = getPage(exports);

  return (
    <Paper className={classes.paper}>
      <Toolbar variant="dense">
        <Button onClick={() => onExportClick('JSON')}>
          {'Export to JSON'}
          <TableIcon className={classes.rightIcon} color="secondary" />
        </Button>
        <Button onClick={() => onExportClick('ZIP')}>
          {'Export to Zip'}
          <FolderIcon className={classes.rightIcon} color="secondary" />
        </Button>
        {/* <IconButtonRefresh onClick={this.reload} /> */}
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Id</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Type</TableCell>
            <TableCell align="left">Info</TableCell>
            <TableCell align="left">Created At</TableCell>
            <TableCell align="left">Creator</TableCell>
            <TableCell align="left">Download</TableCell>
            <TableCell align="left">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pageItems.map((dataExport: IDataExport) => {
            return (
              <TableRow key={dataExport.id} hover={true}>
                <TableCell align="left">{dataExport.id}</TableCell>
                <TableCell align="left">{dataExport.status}</TableCell>
                <TableCell align="left">{dataExport.kind}</TableCell>
                <TableCell align="left">{dataExport.info}</TableCell>
                <TableCell align="left">
                  {new Date(parseInt(dataExport.createdAt)).toISOString()}
                </TableCell>
                <TableCell align="left">{dataExport.creator}</TableCell>
                <TableCell align="left">
                  <IconButton
                    disabled={dataExport.url === null}
                    style={{ padding: 6 }}
                    href={dataExport.url}>
                    <CloudDownloadIcon color="secondary" />
                  </IconButton>
                </TableCell>
                <TableCell align="left">
                  <IconButton
                    style={{ padding: 6 }}
                    onClick={onDeleteExportClick(dataExport.id)}>
                    <DeleteIcon color="secondary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={3}
              count={exports.length}
              rowsPerPage={10}
              page={state.page}
              SelectProps={{
                native: true,
              }}
              onChangePage={handleChangePage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  );
}

const GET_DATA_EXPORTS = gql`
  query($agentId: Int!) {
    ChatbotService_dataExports(agentId: $agentId) {
      id
      agentId
      status
      info
      kind
      createdAt
      creator
      url
    }
  }
`;

const CREATE_EXPORT = gql`
  mutation createDataExport(
    $agentId: Int!
    $kind: ChatbotService_DataExportKind
  ) {
    ChatbotService_createDataExport(agentId: $agentId, kind: $kind) {
      id
      agentId
      status
      createdAt
      creator
    }
  }
`;

const DELETE_EXPORT = gql`
  mutation($exportId: Int!) {
    ChatbotService_deleteDataExport(exportId: $exportId) {
      id
      status
    }
  }
`;

export default DataExportsTable;
