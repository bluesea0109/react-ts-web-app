import { useMutation, useQuery } from '@apollo/client';
import { CommonTable, Button } from '@bavard/react-components';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import TableIcon from '@material-ui/icons/TableChart';
import gql from 'graphql-tag';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ILabelsExport } from '../../../../models/image-labeling-service';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
  }),
);

function ExportsTable() {
  const classes = useStyles();
  const params = useParams<{
    collectionId: string;
  }>();
  const collectionId = parseInt(params.collectionId, 10);

  interface IGetLabelExports {
    ImageLabelingService_labelExports: ILabelsExport[];
  }
  const getExports = useQuery<IGetLabelExports>(GET_LABEL_EXPORTS, {
    variables: { collectionId },
  });
  const [createExport, createExportResult] = useMutation(CREATE_EXPORT, {
    refetchQueries: [
      {
        query: GET_LABEL_EXPORTS,
        variables: {
          collectionId,
        },
      },
    ],
    awaitRefetchQueries: true,
  });
  const [deleteExport, deleteExportResult] = useMutation(DELETE_EXPORT, {
    refetchQueries: [
      {
        query: GET_LABEL_EXPORTS,
        variables: {
          collectionId,
        },
      },
    ],
    awaitRefetchQueries: true,
  });

  const onExportClick = async () => {
    // create export mutation
    createExport({
      variables: {
        collectionId,
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
    return <ContentLoading />;
  }

  const exports = getExports.data?.ImageLabelingService_labelExports ?? [];

  const columns = [
    { title: 'Id', field: 'id' },
    { title: 'Status', field: 'status' },
    {
      title: 'Created At',
      field: 'createdAt',
      renderRow: (rowData: ILabelsExport) =>
        new Date(parseInt(rowData.createdAt)).toISOString(),
    },
    { title: 'Creator', field: 'creator' },
    {
      title: 'Download',
      field: 'signedUrl',
      renderRow: (rowData: ILabelsExport) => (
        <IconButton style={{ padding: 6 }} href={rowData.signedUrl}>
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
        onRowDelete: (rowData: ILabelsExport) =>
          onDeleteExportClick(rowData.id),
      }}
      pagination={{
        colSpan: 3,
        rowsPerPage: 10,
      }}
      components={{
        Toolbar: () => (
          <Toolbar variant="dense">
            <Button title="Export to CSV" onClick={onExportClick}>
              <TableIcon className={classes.rightIcon} color="secondary" />
            </Button>
          </Toolbar>
        ),
      }}
    />
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
