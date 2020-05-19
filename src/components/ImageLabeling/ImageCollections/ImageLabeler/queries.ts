import gql from 'graphql-tag';

export const GET_IMAGE_DATA = gql`
  query test($imageId: Int!, $projectId: String!) {
    ImageLabelingService_image(imageId: $imageId) {
      id
      collectionId
      name
      url
      maskUrl
      approvedBy
      labels {
        id
        shape
        category {
          categorySetId
          name
        }
        value
        creator
      }
    }

    ImageLabelingService_labelQueueImage(imageId: $imageId) {
      collectionId
      imageId
      status
      labeler
    }

    ImageLabelingService_categorySets(projectId: $projectId) {
      id
      name
      categories {
        categorySetId
        name
      }
    }
  }
`;

export const NEXT_LABEL_QUEUE_IMAGE = gql`
  mutation labelQueueItemNext($collectionId: String!) {
    labelQueueItemNext(collectionId: $collectionId) {
      imageId
      status
      labeler
    }
  }
`;

export const COMPLETE_LABEL_QUEUE_IMAGE = gql`
  mutation labelQueueItemComplete($imageId: Int!) {
    labelQueueItemComplete(imageId: $imageId) {
      imageId
      status
      labeler
    }
  }
`;

export const SET_IN_PROGRESS = gql`
  mutation labelQueueItemInProgress($imageId: Int!) {
    labelQueueItemInProgress(imageId: $imageId) {
      imageId
      status
      labeler
    }
  }
`;

export const SAVE_LABELS = gql`
  mutation saveImageLabels(
    $imageId: Int!,
    $labels: [ImageLabelingService_ImageLabelInput]!) {

    ImageLabelingService_saveImageLabels(imageId: $imageId, labels: $labels) {
      id
      imageId
      shape
      category {
        categorySetId
        name
      }
      value
      creator
    }

  }
`;

export const DELETE_LABEL = gql`
  mutation deleteImageCategoricalLabel(
    $id: Int!,
  ) {
    deleteImageCategoricalLabel(
      id: $id,
    ) {
      id
      status
    }
  }
`;
