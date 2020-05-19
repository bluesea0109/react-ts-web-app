import React from 'react';
import { useQuery } from 'react-apollo';
import { useParams } from 'react-router';
import { ICategorySet, IImage, IImageLabel, ILabelQueueImage } from '../../../../models';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
import ImageCategoricalLabel from '../../models/labels/ImageLabel';
import ImageLabelingPageContent from './ImageLabelerContent';
import { GET_IMAGE_DATA } from './queries';

function ImageLabeler() {
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
  });

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  if (loading || !data) {
    return <ContentLoading />;
  }

  const loadLabels = (imageLabels: IImageLabel[]) => {
    const labels = [];
    for (const labelData of imageLabels) {
      const label = ImageCategoricalLabel.fromServerData(labelData);
      labels.push(label);
    }
    return labels;
  };

  console.log('label queue image', data.ImageLabelingService_labelQueueImage);

  return (
    <ImageLabelingPageContent
      projectId={projectId}
      labelQueueImage={data.ImageLabelingService_labelQueueImage}
      image={data.ImageLabelingService_image}
      labels={loadLabels(data.ImageLabelingService_image.labels)}
      categorySets={data.ImageLabelingService_categorySets}
    />
  );
}

export default ImageLabeler;
