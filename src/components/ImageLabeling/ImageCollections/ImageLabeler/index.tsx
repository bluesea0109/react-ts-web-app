import { useQuery } from '@apollo/client';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router';
import { ICategorySet, IImage, ILabelQueueImage } from '../../../../models/image-labeling-service';
import * as imageLabelingActions from '../../../../store/image-labeling/actions';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
import ImageLabelingPageContent from './ImageLabelerContent';
import { GET_IMAGE_DATA } from './queries';
import { convertLabels } from './utils';

const mapDispatch = {
  addLabel: imageLabelingActions.addLabel,
  resetLabels: imageLabelingActions.resetLabels,
};

const connector = connect(null, mapDispatch);

function ImageLabeler(props: ConnectedProps<typeof connector>) {
  const params = useParams<{ projectId: string, imageId?: string}>();
  const { projectId, imageId: imageIdStr } = params;

  if (!imageIdStr) {
    throw new Error('imageId url params is required');
  }

  const imageId = parseInt(imageIdStr, 0);

  interface IGetData {
    ImageLabelingService_image: IImage;
    ImageLabelingService_labelQueueImage: ILabelQueueImage;
    ImageLabelingService_categorySets: ICategorySet[];
  }

  const { loading, error, data } = useQuery<IGetData>(GET_IMAGE_DATA, {
    variables: {
      projectId,
      imageId,
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const labels = convertLabels(data.ImageLabelingService_image.labels);
      props.resetLabels(labels);
    },
  });

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  if (loading || !data) {
    return <ContentLoading />;
  }

  return (
    <ImageLabelingPageContent
      projectId={projectId}
      labelQueueImage={data.ImageLabelingService_labelQueueImage}
      image={data.ImageLabelingService_image}
      categorySets={data.ImageLabelingService_categorySets}
    />
  );
}

export default connector(ImageLabeler);
