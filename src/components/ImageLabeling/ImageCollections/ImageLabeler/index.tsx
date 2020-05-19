import React from 'react';
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import ImageLabelingPageContent from './ImageLabelerContent';
import { useParams } from 'react-router';
import ImageCategoricalLabel from '../../models/labels/ImageLabel';
import { IImageLabel, ILabelQueueImage, IImage, ICategorySet } from '../../../../models';
import ContentLoading from '../../../ContentLoading';
import ApolloErrorPage from '../../../ApolloErrorPage';

const GET_DATA = gql`
  query ($imageId: Int!, $projectId: String!) {
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


function ImageLabeler() {
  let { projectId, imageId } = useParams();
  imageId = parseInt(imageId, 10);

  interface IGetData {
    ImageLabelingService_image: IImage;
    ImageLabelingService_labelQueueImage: ILabelQueueImage;
    ImageLabelingService_categorySets: ICategorySet[];
  }

  const { loading, error, data } = useQuery<IGetData>(GET_DATA, {
    variables: {
      projectId,
      imageId
    },
    fetchPolicy: 'network-only'
  })

  if (error) {
    return <ApolloErrorPage error={error} />
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
  }

  console.log('label queue image', data.ImageLabelingService_labelQueueImage)

  return (
    <ImageLabelingPageContent
      labelQueueImage={data.ImageLabelingService_labelQueueImage}
      image={data.ImageLabelingService_image}
      labels={loadLabels(data.ImageLabelingService_image.labels)}
      categorySets={data.ImageLabelingService_categorySets}
    />
  );
}

export default ImageLabeler;
