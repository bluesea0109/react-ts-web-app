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
          categorySetName
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
  mutation($collectionId: Int!) {
    ImageLabelingService_nextLabelQueueImage(collectionId: $collectionId) {
      imageId
      status
      labeler
    }
  }
`;

export const COMPLETE_LABEL_QUEUE_IMAGE = gql`
  mutation($imageId: Int!) {
    ImageLabelingService_completeLabelQueueImage(imageId: $imageId) {
      imageId
      status
      labeler
    }
  }
`;

export const SET_IN_PROGRESS = gql`
  mutation($imageId: Int!) {
    ImageLabelingService_selectLabelQueueImagene(imageId: $imageId) {
      imageId
      status
      labeler
    }
  }
`;

export const SAVE_LABELS = gql`
  mutation saveImageLabels(
    $imageId: Int!
    $labels: [ImageLabelingService_ImageLabelInput!]!
    $delLabelIds: [Int!]!
  ) {
    ImageLabelingService_saveImageLabels(imageId: $imageId, labels: $labels) {
      id
      imageId
      shape
      category {
        categorySetName
        categorySetId
        name
      }
      value
      creator
    }

    ImageLabelingService_deleteImageLabels(labelIds: $delLabelIds) {
      id
    }
  }
`;

export const DELETE_LABEL = gql`
  mutation deleteImageCategoricalLabel($id: Int!) {
    deleteImageCategoricalLabel(id: $id) {
      id
      status
    }
  }
`;
