import React from 'react';
import gql from "graphql-tag";
import { useParams } from 'react-router';
import { convertLabels } from '../../ImageLabeler/utils';
import ApolloErrorPage from '../../../../ApolloErrorPage';
import { useQuery } from '@apollo/react-hooks';
import ContentLoading from '../../../../ContentLoading';
import ImageReviewerContent from './ImageReviewerContent';
import * as imageLabelingActions from '../../../../../store/image-labeling/actions';
import { connect, ConnectedProps } from 'react-redux';

const mapDispatch = {
  resetLabels: imageLabelingActions.resetLabels,
};

const connector = connect(null, mapDispatch);

function ImageReviewer(props: ConnectedProps<typeof connector>) {
  const { projectId, queueId, imageId } = useParams();
  const { loading, error, data } = useQuery(GET_DATA, {
    variables: {
      projectId,
      imageId: parseInt(imageId, 10),
      queueId: parseInt(queueId, 10),
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const labels = convertLabels(data.ImageLabelingService_image.labels);
      props.resetLabels(labels);
    },
  });

  if (loading) {
    return <ContentLoading />;
  }

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  const image = data.ImageLabelingService_image;
  const catSets = data.ImageLabelingService_categorySets;

  return (
    <ImageReviewerContent
      image={image}
      reviewQueueImage={data.ImageLabelingService_reviewQueueImage}
      categorySets={catSets}
    />
  );
}

const GET_DATA = gql`
  query($projectId: String!, $imageId: Int!, $queueId: Int!) {
    ImageLabelingService_image(imageId: $imageId) {
      collectionId
      id
      name
      url
      maskUrl
      approvedBy
      labels {
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
    ImageLabelingService_reviewQueueImage(queueId: $queueId, imageId: $imageId) {
      queueId
      imageId
      reviewer
      status
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

export default connector(ImageReviewer);
