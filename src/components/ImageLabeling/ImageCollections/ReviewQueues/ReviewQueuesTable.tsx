import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useHistory, useParams } from 'react-router-dom';
import { IReviewQueue } from '../../../../models/image-labeling-service';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
import IconButtonPlay from '../../../IconButtons/IconButtonPlay';
import CreateReviewQueueDialog from './CreateReviewQueueDialog';
import DeleteReviewQueueDialog from './DeleteReviewQueueDialog';
import EditReviewQueueDialog from './EditReviewQueueDialog';
import { GET_REVIEW_QUEUES, NEXT_REVIEW_QUEUE_IMAGE } from './gql-queries';

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
    },
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
    files: [],
  });

  interface IGetReviewQueues {
    ImageLabelingService_reviewQueues: IReviewQueue[];
  }
  const getReviewQueues = useQuery<IGetReviewQueues>(GET_REVIEW_QUEUES, {
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

  const startReviewing = (queueId: number) => async () => {
    // todo
    const res = await nextReviewQueueImage({
      variables: { queueId },
    });

    if (res.data) {
      const imageId = res.data.ImageLabelingService_nextReviewQueueImage?.imageId;
      if (imageId) {
        history.push(`/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/review-queues/${queueId}/images/${imageId}`);
      }
    }
  };

  const commonErr = getReviewQueues.error || nextReviewQueueImageResult.error;
  if (commonErr) {
    return <ApolloErrorPage error={commonErr} />;
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
            {'Queues'}
          </Typography>
          <Typography style={{ padding: 2 }} />
          <CreateReviewQueueDialog />
        </Toolbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>{'% Under Review'}</TableCell>
              <TableCell>{'% Approved'}</TableCell>
              <TableCell/>
              <TableCell/>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageItems.map((queue, i) => {
              return (
                <TableRow key={i} hover={true}>
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
                    <EditReviewQueueDialog queue={queue}/>
                  </TableCell>
                  <TableCell>
                    <DeleteReviewQueueDialog queueId={queue.id} collectionId={collectionId}/>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[rowsPerPage]}
                count={reviewQueues.length}
                rowsPerPage={rowsPerPage}
                page={state.page}
                onChangePage={handleChangePage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    </div>
  );
}

export default ReviewQueuesTable;
