import gql from "graphql-tag";

export const NEXT_REVIEW_QUEUE_IMAGE = gql`
  mutation ($queueId: Int!) {
    ImageLabelingService_nextReviewQueueImage(queueId: $queueId) {
      imageId
    }
  }
`;

export const APPROVE_REVIEW_QUEUE_IMAGE = gql`
  mutation ($queueId: Int!, $imageId: Int!) {
    ImageLabelingService_approveReviewQueueImage(queueId: $queueId, imageId: $imageId) {
      imageId
    }
  }
`;

export const DISAPPROVE_REVIEW_QUEUE_IMAGE = gql`
  mutation ($queueId: Int!, $imageId: Int!) {
    ImageLabelingService_disapproveReviewQueueImage(queueId: $queueId, imageId: $imageId) {
      imageId
    }
  }
`;