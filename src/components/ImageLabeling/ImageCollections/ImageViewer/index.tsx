import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import { useParams } from 'react-router';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
import ImageCategoricalLabel from '../../models/labels/ImageLabel';
import ImageViewerContent from './ImageViewerContent';

const GET_DATA = gql`
  query($projectId: String!, $imageId: Int!) {
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
    ImageLabelingService_labelQueueImage(imageId: $imageId) {
      labeler
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

const ImageViewer: React.FC = () => {
  const { imageId } = useParams();
  const { projectId } = useParams();
  const { loading, error, data } = useQuery(GET_DATA, {
    variables: {
      projectId,
      imageId: parseInt(imageId, 10),
    },
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <ContentLoading />;
  }

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  const image = data.ImageLabelingService_image;
  const labelQueueImage = data.ImageLabelingService_labelQueueImage;
  const serverLabels = image.labels;
  const labels = [];
  for (const labelData of serverLabels) {
    const label = ImageCategoricalLabel.fromServerData(labelData);
    labels.push(label);
  }
  const categorySets = data.ImageLabelingService_categorySets;
  return (
    <ImageViewerContent
      image={image}
      labelQueueImage={labelQueueImage}
      labels={labels}
      categorySets={categorySets}
    />
  );
};

export default ImageViewer;
