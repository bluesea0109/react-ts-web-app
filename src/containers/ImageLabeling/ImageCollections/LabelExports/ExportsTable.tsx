import { useMutation, useQuery } from '@apollo/client';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
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
import TableIcon from '@material-ui/icons/TableChart';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ILabelsExport } from '../../../../models/image-labeling-service';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
// import IconButtonRefresh from './IconButtonRefresh';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    paper: {
      margin: theme.spacing(1),
    },
  }));

function ExportsTable() {
  const rowsPerPage = 10;
  const classes = useStyles();
  let { collectionId } = useParams();
  collectionId = parseInt(collectionId, 10);

  interface IGetLabelExports {
    ImageLabelingService_labelExports: ILabelsExport[];
  }
  const getExports = useQuery<IGetLabelExports>(GET_LABEL_EXPORTS, { variables: { collectionId } });
  const [createExport, createExportResult] = useMutation(CREATE_EXPORT, {
    refetchQueries: [{
      query: GET_LABEL_EXPORTS,
      variables: {
        collectionId,
      },
    }],
    awaitRefetchQueries: true,
  });
  const [deleteExport, deleteExportResult] = useMutation(DELETE_EXPORT, {
    refetchQueries: [{
      query: GET_LABEL_EXPORTS,
      variables: {
        collectionId,
      },
    }],
    awaitRefetchQueries: true,
  });

  const [state, setState] = useState({
    loading: false,
    page: 0,
  });

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setState({ ...state, page });
  };

  const getPage = (exports: ILabelsExport[]) => {
    const { page } = state;
    return exports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const onExportClick = async () => {
    // create export mutation
    createExport({
      variables: {
        collectionId,
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
    return <ApolloErrorPage error={getExports.error}/>;
  }

  if (createExportResult.error) {
    return <ApolloErrorPage error={createExportResult.error}/>;
  }

  if (deleteExportResult.error) {
    return <ApolloErrorPage error={deleteExportResult.error}/>;
  }

  if (getExports.loading || createExportResult.loading || deleteExportResult.loading) {
    return <ContentLoading />;
  }

  const exports = getExports.data?.ImageLabelingService_labelExports ?? [];
  const pageItems = getPage(exports);

  return (
    <Paper className={classes.paper}>
      <Toolbar variant="dense">
        <Button onClick={onExportClick}>
          {'Export to CSV'}
          <TableIcon
            className={classes.rightIcon}
            color="secondary"/>
        </Button>
        {/* <IconButtonRefresh onClick={this.reload} /> */}
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Id</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Created At</TableCell>
            <TableCell align="left">Creator</TableCell>
            <TableCell align="left">Download</TableCell>
            <TableCell align="left">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pageItems.map((labelExport: ILabelsExport) => {
            return (
              <TableRow key={labelExport.id} hover={true}>
                <TableCell align="left">{labelExport.id}</TableCell>
                <TableCell align="left">{labelExport.status}</TableCell>
                <TableCell align="left">
                  {new Date(parseInt(labelExport.createdAt)).toISOString()}
                </TableCell>
                <TableCell align="left">{labelExport.creator}</TableCell>
                <TableCell align="left">
                  <IconButton
                    style={{ padding: 6 }}
                    href={labelExport.signedUrl}>
                    <CloudDownloadIcon color="secondary" />
                  </IconButton>
                </TableCell>
                <TableCell align="left">
                  <IconButton
                    style={{ padding: 6 }}
                    onClick={onDeleteExportClick(labelExport.id)}>
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

const GET_LABEL_EXPORTS = gql`
  query($collectionId: Int!) {
    ImageLabelingService_labelExports(collectionId: $collectionId) {
      id
      collectionId
      status
      createdAt
      creator
      signedUrl
    }
  }
`;

const CREATE_EXPORT = gql`
  mutation createLabelExport($collectionId: Int!) {
    ImageLabelingService_createLabelExport(collectionId: $collectionId) {
      id
      collectionId
      status
      createdAt
      creator
    }
  }
`;

const DELETE_EXPORT = gql`
  mutation($exportId: Int!) {
    ImageLabelingService_deleteLabelExport(exportId: $exportId) {
      id
      status
    }
  }
`;

export default ExportsTable;
