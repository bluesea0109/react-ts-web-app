import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import gql from "graphql-tag";
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Paper from '@material-ui/core/Paper';
import CheckIcon from '@material-ui/icons/CheckCircle';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router';
import IconButtonPlay from '../../IconButtonPlay';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import UploadImagesDialog from './UploadImagesDialog';

const paginationStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      color: theme.palette.text.secondary,
      marginLeft: theme.spacing(2.5),
    },
  })
);


interface ITablePaginationActions {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: ITablePaginationActions) {
  const classes = paginationStyles();
  const theme = useTheme();
  const { page, count, rowsPerPage } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onChangePage(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onChangePage(event, props.page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onChangePage(event, props.page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onChangePage(
      event,
      Math.max(0, Math.ceil(props.count / props.rowsPerPage) - 1),
    );
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="First Page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="Previous Page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Next Page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Last Page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(1)
    },
    unLabeledIcon: {
      color: 'red'
    }
  })
);

interface IImagesTableProps {
  collectionId: number
}

function ImagesTable(props: IImagesTableProps) {
  const { collectionId } = props;
  const classes = styles();
  const { orgId, projectId } = useParams();
  const [state, setState] = useState({
    loading: false,
    page: 0,
    rowsPerPage: 5,
    offset: 0,
    uploadDialogOpen: false,
    files: []
  });

  const { loading, error, data, refetch, fetchMore, startPolling, stopPolling } = useQuery(
    GET_COLLECTION_DATA,
    {
      variables: {
        collectionId,
        offset: state.offset,
        limit: state.rowsPerPage
      },
      fetchPolicy: "network-only",
    }
  );

  const client = useApolloClient();
  const history = useHistory();

  useEffect(() => {
    console.log('start polling');
    startPolling(3000);
    return function cleanUp() {
      console.log('Stop polling');
      stopPolling();
    }
  }, [startPolling, stopPolling]);

  const startLabeling = async () => {
    const { data } = await client.mutate({
      mutation: NEXT_LABEL_QUEUE_IMAGE,
      variables: {
        collectionId,
      },
      errorPolicy: "ignore"
    });

    if (data && data.ImageLabelingService_nextLabelQueueImage) {
      const { imageId } = data.ImageLabelingService_nextLabelQueueImage;
      history.push({
        pathname: `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/label-image/${imageId}`
      });
    };
  }

  const handleImageClick = (imageId: number) => () => {
    history.push({
      pathname: `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/images/${imageId}`,
    });
  }

  const handleChangePage = async (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    stopPolling();

    setState({
      ...state,
      offset: page * 5,
      page
    })

    refetch({
      collectionId,
      offset: page * 5,
      limit: state.rowsPerPage,
    });
    
    fetchMore({
      variables: {
        offset: page * 5
      },
      updateQuery: (prev: any, { fetchMoreResult }: { fetchMoreResult?: any }) => {
        if (!fetchMoreResult) return prev;
        return fetchMoreResult
      }
    });

    startPolling(3000);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setState({
      ...state,
      rowsPerPage: (parseInt(event.target.value, 10)),
      page: 0
    });
  }

  if (error) {
    return <ApolloErrorPage error={error} />

  }
  if (loading || state.loading) {
    return <ContentLoading />;
  }

  const collection = data.ImageLabelingService_collectionById;
  const pageImages = data.ImageLabelingService_images;

  const imageUploadDialog = (
    <UploadImagesDialog collectionId={collectionId} />
  );

  return (
    <Paper className={classes.paper}>
      <Toolbar variant="dense">
        {imageUploadDialog}
        <IconButtonPlay tooltip="Start Labeling" onClick={startLabeling} />
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Size (bytes)</TableCell>
            <TableCell>MD5</TableCell>
            <TableCell>Labeled</TableCell>
            <TableCell>Approved</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pageImages.map((image: any, i: number) => {
            return (
              <TableRow key={i} onClick={handleImageClick(image.id)} hover>
                <TableCell>
                  {image.id}
                </TableCell>
                <TableCell>
                  {image.name}
                </TableCell>
                <TableCell>
                  {(new Date(parseInt(image.createdAt))).toISOString()}
                </TableCell>
                <TableCell>
                  {image.size}
                </TableCell>
                <TableCell>
                  {image.digest}
                </TableCell>
                <TableCell>
                  {image.isLabeled ? <CheckIcon color="secondary" fontSize="small" /> : <RemoveIcon className={classes.unLabeledIcon} color="error" fontSize="small" />}
                </TableCell>
                <TableCell>
                  {image.approvedBy.length > 0 ? <CheckIcon color="secondary" fontSize="small" /> : <RemoveIcon className={classes.unLabeledIcon} color="error" fontSize="small" />}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5]}
              colSpan={3}
              count={collection.imageCount}
              rowsPerPage={state.rowsPerPage}
              page={state.page}
              SelectProps={{
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  );
}

const NEXT_LABEL_QUEUE_IMAGE = gql`
  mutation($collectionId: Int!) {
    ImageLabelingService_nextLabelQueueImage(collectionId: $collectionId) {
      imageId
    }
  }
`;


const GET_COLLECTION_DATA = gql`
  query ($collectionId: Int!, $offset: Int!, $limit: Int!) {
    ImageLabelingService_collectionById(collectionId: $collectionId) {
      id
      projectId
      name
      imageCount
      labeledImageCount
    }

    ImageLabelingService_images(collectionId: $collectionId, offset: $offset, limit: $limit) {
      collectionId,
      id,
      name,
      createdAt,
      size,
      digest
      isLabeled
      approvedBy
    }
  }
`;

export default ImagesTable;
