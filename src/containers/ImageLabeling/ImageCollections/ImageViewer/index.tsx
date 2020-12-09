import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router';
import * as imageLabelingActions from '../../../../store/image-labeling/actions';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
import ImageCategoricalLabel from '../../models/labels/ImageLabel';
import { convertLabels } from '../ImageLabeler/utils';
import ImageViewerContent from './ImageViewerContent';

const GET_DATA = gql`
  query($workspaceId: String!, $imageId: Int!) {
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
          categorySetName
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
    ImageLabelingService_categorySets(workspaceId: $workspaceId) {
      id
      name
      categories {
        categorySetId
        name
      }
    }
  }
`;

const mapDispatch = {
  resetLabels: imageLabelingActions.resetLabels,
};

const connector = connect(null, mapDispatch);

function ImageViewer(props: ConnectedProps<typeof connector>) {
  const { imageId, workspaceId } = useParams<{
    imageId: string;
    workspaceId: string;
  }>();
  const { data, error, loading } = useQuery(GET_DATA, {
    variables: {
      workspaceId,
      imageId: parseInt(imageId, 10),
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
}

export default connector(ImageViewer);
