import { useMutation, useQuery } from '@apollo/client';
import { CommonTable } from '@bavard/react-components';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IReviewQueue } from '../../../../models/image-labeling-service';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
import IconButtonPlay from '../../../IconButtons/IconButtonPlay';
import CreateReviewQueueDialog from './CreateReviewQueueDialog';
import DeleteReviewQueueDialog from './DeleteReviewQueueDialog';
import EditReviewQueueDialog from './EditReviewQueueDialog';
import { GET_REVIEW_QUEUES, NEXT_REVIEW_QUEUE_IMAGE } from './gql-queries';

function ReviewQueuesTable() {
  const rowsPerPage = 10;
  const { orgId, projectId } = useParams<{
    orgId: string;
    projectId: string;
  }>();
  const params = useParams<{
    collectionId: string;
  }>();
  const collectionId = parseInt(params.collectionId, 10);
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

  const [nextReviewQueueImage, nextReviewQueueImageResult] = useMutation(
    NEXT_REVIEW_QUEUE_IMAGE,
  );
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => {
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
      const imageId =
        res.data.ImageLabelingService_nextReviewQueueImage?.imageId;
      if (imageId) {
        history.push(
          `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/review-queues/${queueId}/images/${imageId}`,
        );
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

  const reviewQueues =
    getReviewQueues.data?.ImageLabelingService_reviewQueues || [];
  const pageItems = getPage(reviewQueues);

  const columns = [
    { title: 'Id', field: 'id' },
    { title: 'Name', field: 'name' },
    {
      title: '% Under Review',
      field: 'percentUnderReview',
      renderRow: (rowData: any) => rowData.percentUnderReview.toFixed(2),
    },
    {
      title: '% Approved',
      field: 'percentApproved',
      renderRow: (rowData: any) => rowData.percentApproved.toFixed(2),
    },
    {
      title: 'Review',
      renderRow: (rowData: any) => (
        <IconButtonPlay
          tooltip="Start Reviewing"
          onClick={startReviewing(rowData.id)}
        />
      ),
    },
    {
      title: 'Edit',
      renderRow: (rowData: any) => <EditReviewQueueDialog queue={rowData} />,
    },
    {
      title: 'Delete',
      renderRow: (rowData: any) => (
        <DeleteReviewQueueDialog
          queueId={rowData.id}
          collectionId={collectionId}
        />
      ),
    },
  ];

  return (
    <CommonTable
      data={{
        columns,
      }}
      components={{
        Toolbar: () => (
          <Toolbar variant="dense" disableGutters={true}>
            <Typography variant="h6">{'Queues'}</Typography>
            <Typography style={{ padding: 2 }} />
            <CreateReviewQueueDialog />
          </Toolbar>
        ),
      }}
      pagination={{
        colSpan: 7,
        rowsPerPage: 10,
      }}
    />
  );
}

export default ReviewQueuesTable;
