import { useApolloClient } from '@apollo/client';
import { IImageOption } from '@bavard/agent-config';
import { Grid } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { GET_SIGNED_IMG_UPLOAD_URL } from '../../../common-gql-queries';
import { ImageSelectorGrid } from '../../../components';
import { OptionImagesContext } from '../../../context/OptionImages';
import { IOptionImage } from '../../../models/chatbot-service';
import { IGetImageUploadSignedUrlQueryResult } from '../../../models/common-service';
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

  const [existingImg, setExistingImg] = useState<string | undefined>(option.imageName);

  const optionImages = useContext(OptionImagesContext)?.optionImages || [];

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
    console.log(imageName, imageUrl);
    // The upload url isn't ready. Wait for a few
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

    // Signed upload url is ready. Upload the file
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
    setExistingImg('');
  };

  const handleSelectImg = (img: IOptionImage) => {
    onEditOption({
      ...option,
      imageName: img.name,
    });
    setExistingImg(img.name);
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
