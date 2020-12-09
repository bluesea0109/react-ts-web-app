import { useApolloClient, useQuery } from '@apollo/client';
import { IImageOption } from '@bavard/agent-config';
import { ImageSelectorGrid } from '@bavard/react-components';
import { Grid } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useParams } from 'react-router';
import {
  GET_OPTION_IMAGES_QUERY,
  GET_SIGNED_IMG_UPLOAD_URL,
} from '../../../common-gql-queries';
import { IOptionImage } from '../../../models/chatbot-service';
import { IGetOptionImagesQueryResult } from '../../../models/common-service';
import { uploadImageFile } from '../../../utils/file-uploads';
import ApolloErrorPage from '../../ApolloErrorPage';

interface OptionImageUploaderProps {
  option: IImageOption;
  onUpdateOption: (option: IImageOption) => void;
}

const OptionImageUploader = ({
  option,
  onUpdateOption,
}: OptionImageUploaderProps) => {
  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);
  const { enqueueSnackbar } = useSnackbar();
  const client = useApolloClient();
  const {
    data: imageData,
    error: imageError,
  } = useQuery<IGetOptionImagesQueryResult>(GET_OPTION_IMAGES_QUERY, {
    variables: { agentId },
  });

  if (imageError) {
    return <ApolloErrorPage error={imageError} />;
  }

  const optionImages = imageData?.ChatbotService_optionImages || [];

  const handleNewImg = async (file: File) => {
    // Get a signed upload url
    const imageName = file.name;
    const { data, errors } = await client.query({
      query: GET_SIGNED_IMG_UPLOAD_URL,
      variables: { agentId, basename: imageName },
      fetchPolicy: 'network-only',
    });

    if (errors?.[0]) {
      enqueueSnackbar(`Image upload failed ${errors[0]}`, { variant: 'error' });
    }

    const imageUrl = data.ChatbotService_imageOptionUploadUrl?.url.replace(
      /"/g,
      '',
    );
    if (!imageUrl || imageUrl.indexOf(encodeURIComponent(imageName)) === -1) {
      enqueueSnackbar(
        'Image upload not ready. Please try in 10 seconds, or try a new image',
        { variant: 'error' },
      );
      return;
    }

    try {
      await uploadImageFile(file, imageUrl);
    } catch (e) {
      enqueueSnackbar(
        `Error with uploading the image to GCS - ${JSON.stringify(e)}`,
        { variant: 'error' },
      );
    }

    onUpdateOption({
      ...option,
      imageName,
      imageUrl,
    });
  };

  const handleSelectImg = (img: IOptionImage) => {
    onUpdateOption({
      ...option,
      imageName: img.name,
      imageUrl: img.url,
    });
  };

  return (
    <Grid container={true} item={true} xs={12}>
      <ImageSelectorGrid
        onNewImg={handleNewImg}
        selectedImgName={option.imageName || ''}
        images={optionImages}
        onSelect={handleSelectImg}
      />
    </Grid>
  );
};

export default OptionImageUploader;
