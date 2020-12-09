import { useMutation, useQuery } from '@apollo/client';
import { Button, CommonTable } from '@bavard/react-components';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FolderIcon from '@material-ui/icons/Folder';
import TableIcon from '@material-ui/icons/TableChart';
import gql from 'graphql-tag';
import React from 'react';
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

  const onExportClick = async (kind: 'JSON' | 'ZIP') => {
    // create export mutation
    createExport({
      variables: {
        agentId,
        kind,
      },
    });
  };

  const onDeleteExportClick = (exportId: number) => {
    deleteExport({
      variables: {
        exportId,
      },
    });
  };

  const commonError =
    getExports.error || createExportResult.error || deleteExportResult.error;

  if (commonError) {
    return <ApolloErrorPage error={commonError} />;
  }

  if (
    getExports.loading ||
    createExportResult.loading ||
    deleteExportResult.loading
  ) {
    return <ContentLoading shrinked={true} />;
  }

  const exports = getExports.data?.ChatbotService_dataExports ?? [];

  const columns = [
    { title: 'Id', field: 'id' },
    { title: 'Status', field: 'status' },
    { title: 'Type', field: 'kind' },
    { title: 'Info', field: 'info' },
    {
      title: 'Created At',
      field: 'createdAt',
      renderRow: (rowData: IDataExport) =>
        new Date(parseInt(rowData.createdAt)).toISOString(),
    },
    { title: 'Creator', field: 'creator' },
    {
      title: 'Download',
      field: 'url',
      renderRow: (rowData: IDataExport) => (
        <IconButton
          disabled={rowData.url === null}
          style={{ padding: 6 }}
          href={rowData.url}>
          <CloudDownloadIcon color="secondary" />
        </IconButton>
      ),
    },
  ];

  return (
    <CommonTable
      data={{
        columns,
        rowsData: exports,
      }}
      editable={{
        isDeleteable: true,
        onRowDelete: (rowData: IDataExport) => onDeleteExportClick(rowData.id),
      }}
      pagination={{
        colSpan: 3,
        rowsPerPage: 10,
      }}
      components={{
        Toolbar: () => (
          <Toolbar variant="dense">
            <Button
              title="Export to JSON"
              RightIcon={TableIcon}
              onClick={() => onExportClick('JSON')}
            />
            <Button
              title="'Export to Zip'"
              RightIcon={FolderIcon}
              onClick={() => onExportClick('ZIP')}
            />
          </Toolbar>
        ),
      }}
    />
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
