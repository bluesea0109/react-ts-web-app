import gql from 'graphql-tag';

export const GET_REVIEW_QUEUES = gql`
  query($collectionId: Int!) {
    ImageLabelingService_reviewQueues(collectionId: $collectionId) {
      id
      collectionId
      name
      percentUnderReview
      percentApproved
    }
  }
`;

export const CREATE_REVIEW_QUEUE = gql`
  mutation($collectionId: Int!, $name: String!) {
    ImageLabelingService_createReviewQueue(
      collectionId: $collectionId
      name: $name
    ) {
      id
      collectionId
      name
      percentUnderReview
      percentApproved
    }
  }
`;

export const DELETE_REVIEW_QUEUE = gql`
  mutation($queueId: Int!) {
    ImageLabelingService_deleteReviewQueue(queueId: $queueId) {
      id
      collectionId
      name
      percentUnderReview
      percentApproved
    }
  }
`;

export const NEXT_REVIEW_QUEUE_IMAGE = gql`
  mutation($queueId: Int!) {
    ImageLabelingService_nextReviewQueueImage(queueId: $queueId) {
      imageId
    }
  }
`;

export const UPDATE_REVIEW_QUEUE = gql`
  mutation($queueId: Int!, $name: String!) {
    ImageLabelingService_updateReviewQueue(queueId: $queueId, name: $name) {
      id
      collectionId
      name
      percentUnderReview
      percentApproved
    }
  }
`;
