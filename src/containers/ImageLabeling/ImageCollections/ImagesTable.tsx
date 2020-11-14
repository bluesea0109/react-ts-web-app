import { useQuery } from '@apollo/client';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import CheckIcon from '@material-ui/icons/CheckCircle';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import StartLabelingDialog from './StartLabelingDialog';
import UploadImagesDialog from './UploadImagesDialog';
import { CommonTable } from '../../../components';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(1),
    },
    unLabeledIcon: {
      color: 'red',
    },
  }),
);

interface IImagesTableProps {
  collectionId: number;
}

function ImagesTable({ collectionId }: IImagesTableProps) {
  const ImagesPerPage = 10;
  const classes = useStyles();
  const { orgId, projectId } = useParams<{
    orgId: string;
    projectId: string;
  }>();
  const [state, setState] = useState({
    loading: false,
    page: 0,
    rowsPerPage: ImagesPerPage,
    offset: 0,
    uploadDialogOpen: false,
    files: [],
  });

  const {
    loading,
    error,
    data,
    refetch,
    fetchMore,
    startPolling,
    stopPolling,
  } = useQuery(GET_COLLECTION_DATA, {
    variables: {
      collectionId,
      offset: state.offset,
      limit: state.rowsPerPage,
    },
    fetchPolicy: 'network-only',
  });
  const history = useHistory();

  useEffect(() => {
    startPolling(3000);
    return function cleanUp() {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const handleImageClick = (imageId: number) => () => {
    history.push({
      pathname: `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/images/${imageId}`,
    });
  };

  const handleChangePage = async (page: number) => {
    stopPolling();

    setState({
      ...state,
      offset: page * ImagesPerPage,
      page,
    });

    refetch({
      collectionId,
      offset: page * ImagesPerPage,
      limit: state.rowsPerPage,
    });

    fetchMore({
      variables: {
        offset: page * ImagesPerPage,
      },
      updateQuery: (
        prev: any,
        { fetchMoreResult }: { fetchMoreResult?: any },
      ) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return fetchMoreResult;
      },
    });

    startPolling(3000);
  };

  if (error) {
    return <ApolloErrorPage error={error} />;
  }
  if (loading || state.loading) {
    return <ContentLoading />;
  }

  const pageImages = data.ImageLabelingService_images;

  const imageUploadDialog = <UploadImagesDialog collectionId={collectionId} />;

  const columns = [
    { title: 'Id', field: 'id' },
    { title: 'Name', field: 'name' },
    {
      title: 'Created At',
      field: 'createdAt',
      renderRow: (image: any) =>
        new Date(parseInt(image.createdAt)).toISOString(),
    },
    { title: 'Size (bytes)', field: 'size' },
    { title: 'MD5', field: 'digest' },
    {
      title: 'Labeled',
      field: 'isLabeled',
      renderRow: (image: any) =>
        image.isLabeled ? (
          <CheckIcon color="secondary" fontSize="small" />
        ) : (
          <RemoveIcon
            className={classes.unLabeledIcon}
            color="error"
            fontSize="small"
          />
        ),
    },
    {
      title: 'Approved',
      field: 'approvedBy',
      renderRow: (image: any) =>
        image.approvedBy.length > 0 ? (
          <CheckIcon color="secondary" fontSize="small" />
        ) : (
          <RemoveIcon
            className={classes.unLabeledIcon}
            color="error"
            fontSize="small"
          />
        ),
    },
  ];

  return (
    <Paper className={classes.paper}>
      <CommonTable
        data={{
          columns,
          rowsData: pageImages,
        }}
        eventHandlers={{
          onRowClick: (image: any) => handleImageClick(image.id),
        }}
        components={{
          Toolbar: () => (
            <Toolbar variant="dense">
              {imageUploadDialog}
              <StartLabelingDialog />
            </Toolbar>
          ),
        }}
        pagination={{
          isAsync: true,
          asyncPage: state.page,
          rowsPerPage: ImagesPerPage,
          asyncTotalCount: -1,
          onUpdatePage: handleChangePage,
        }}
      />
    </Paper>
  );
}

const GET_COLLECTION_DATA = gql`
  query($collectionId: Int!, $offset: Int!, $limit: Int!) {
    ImageLabelingService_collectionById(collectionId: $collectionId) {
      id
      projectId
      name
      imageCount
      labeledImageCount
    }

    ImageLabelingService_images(
      collectionId: $collectionId
      offset: $offset
      limit: $limit
    ) {
      collectionId
      id
      name
      createdAt
      size
      digest
      isLabeled
      approvedBy
    }
  }
`;

export default ImagesTable;
