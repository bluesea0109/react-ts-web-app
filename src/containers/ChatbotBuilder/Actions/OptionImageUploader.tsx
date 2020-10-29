import { useApolloClient, useQuery } from '@apollo/client';
import { IImageOption } from '@bavard/agent-config';
import { Grid } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useParams } from 'react-router';
import { GET_OPTION_IMAGES_QUERY, GET_SIGNED_IMG_UPLOAD_URL } from '../../../common-gql-queries';
import { ImageSelectorGrid } from '../../../components';
import { IOptionImage } from '../../../models/chatbot-service';
import { IGetOptionImagesQueryResult } from '../../../models/common-service';
import { uploadFileWithFetch } from '../../../utils/xhr';

interface OptionImageUploaderProps {
  option: IImageOption;
  onEditOption: (option: IImageOption) => void;
}

const OptionImageUploader = ({
  option,
  onEditOption,
}: OptionImageUploaderProps) => {
  const { agentId } = useParams<{ agentId: string; }>();
  const numAgentId = Number(agentId);
  const { enqueueSnackbar } = useSnackbar();
  const client = useApolloClient();
  const getImagesQuery = useQuery<IGetOptionImagesQueryResult>(GET_OPTION_IMAGES_QUERY, {
    variables: { agentId: numAgentId },
  });
  const optionImages = getImagesQuery.data?.ChatbotService_optionImages || [];

  const handleNewImg = async (file: File) => {
    // Get a signed upload url
    const imageName = file.name;
    const { data, errors } = await client.query({
      query: GET_SIGNED_IMG_UPLOAD_URL,
      variables: { agentId: numAgentId, basename: imageName },
      fetchPolicy: 'network-only',
    });

    if (errors?.[0]) {
      enqueueSnackbar(
        `Image upload failed ${errors[0]}`,
        { variant: 'error' },
      );
    }

    const imageUrl = data.ChatbotService_imageOptionUploadUrl?.url.replace(/"/g, '');
    if (
      !imageUrl ||
      imageUrl.indexOf(encodeURIComponent(imageName)) === -1
    ) {
      enqueueSnackbar(
        'Image upload not ready. Please try in 10 seconds, or try a new image',
        { variant: 'error' },
      );
      return;
    }

    try {
      await uploadFileWithFetch(file, imageUrl, 'PUT');
    } catch (e) {
      enqueueSnackbar(
        `Error with uploading the image to GCS - ${JSON.stringify(e)}`,
        { variant: 'error' },
      );
    }

    onEditOption({
      ...option,
      imageName,
      imageUrl,
    });
  };

  const handleSelectImg = (img: IOptionImage) => {
    onEditOption({
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