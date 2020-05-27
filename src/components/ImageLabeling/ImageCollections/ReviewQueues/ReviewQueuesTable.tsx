import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
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
import { graphql, useMutation, useQuery } from 'react-apollo';
import { withRouter, useParams, useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import IconButtonPlay from '../../../IconButtons/IconButtonPlay';
import IconButtonEdit from '../../../IconButtons/IconButtonEdit';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
import { IReviewQueue } from '../../../../models';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      margin: theme.spacing(1),
    },
    paper: {
      padding: theme.spacing(1),
    }
  }));

function ReviewQueuesTable() {
  const classes = useStyles();
  const rowsPerPage = 10;
  const { orgId, projectId } = useParams();
  let { collectionId } = useParams();
  collectionId = parseInt(collectionId, 10);

  const history = useHistory();
  const [state, setState] = useState({
    loading: false,
    page: 0,
    offset: 0,
    uploadDialogOpen: false,
    files: []
  });

  const getReviewQueues = useQuery(GET_REVIEW_QUEUES, {
    variables: { collectionId },
  });
  const [nextReviewQueueImage, nextReviewQueueImageResult] = useMutation(NEXT_REVIEW_QUEUE_IMAGE);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setState({ ...state, page });
  };

  const getPage = (queues: IReviewQueue[]) => {
    const { page } = state;
    return queues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const onCreateQueue = () => {
  }

  const onEditQueue = (queueId: number) => () => {
  }

  const onDeleteQueue = (queueId: number) => () => {
  }

  const startReviewing = (queueId: number) => async () => {
    // todo
    // props.history.push(`/app/projects/${projectId}/collections/${collectionId}/queues/${queueId}/images/${itemId}`);
  }

  const commonErr = getReviewQueues.error || nextReviewQueueImageResult.error
  if (commonErr) {
    return <ApolloErrorPage error={commonErr} />
  }

  if (getReviewQueues.loading || nextReviewQueueImageResult.loading) {
    return <ContentLoading />;
  }

  const reviewQueues = getReviewQueues.data?.ImageLabelingService_reviewQueues || [];
  const pageItems = getPage(reviewQueues);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar variant="dense" disableGutters={true}>
          <Typography variant="h6">
            {"Queues"}
          </Typography>
          <Typography style={{ padding: 2 }} />
          {/* <ReviewQueueCreate onCompleted={props.refetch} /> */}
        </Toolbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>{"% Under Review"}</TableCell>
              <TableCell>{"% Approved"}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageItems.map((queue, i) => {
              return (
                <TableRow key={i} hover>
                  <TableCell>
                    {queue.id}
                  </TableCell>
                  <TableCell>
                    {queue.name}
                  </TableCell>
                  <TableCell>
                    {queue.percentUnderReview.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {queue.percentApproved.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <IconButtonPlay tooltip="Start Reviewing"
                      onClick={startReviewing(queue.id)} />
                  </TableCell>
                  <TableCell>
                    <IconButtonEdit tooltip="Edit Queue" onClick={onEditQueue(queue.id)} />
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
                count={reviewQueues.length}
                rowsPerPage={rowsPerPage}
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
    </div>
  );
}

const CREATE_REVIEW_QUEUE = gql`
  mutation ($collectionId: Int!, $name: String!) {
    ImageLabelingService_createReviewQueue(collectionId: $collectionId, name: $name) {
      id
      name
      percentUnderReview
      percentApproved
    }
  }
`;

const DELETE_REVIEW_QUEUE = gql`
  mutation ($queueId: Int!) {
    ImageLabelingService_deleteReviewQueue(queueId: $queueId) {
      id
      name
      percentUnderReview
      percentApproved
    }
  }
`;

const NEXT_REVIEW_QUEUE_IMAGE = gql`
  mutation($queueId: Int!) {
    ImageLabelingService_nextReviewQueueImage(queueId: $queueId) {
      imageId
    }
  }
`;

const GET_REVIEW_QUEUES = gql`
  query ($collectionId: Int!) {
    ImageLabelingService_reviewQueues(collectionId: $collectionId) {
      id
      name
      percentUnderReview
      percentApproved
    }
  }
`;

export default ReviewQueuesTable;
