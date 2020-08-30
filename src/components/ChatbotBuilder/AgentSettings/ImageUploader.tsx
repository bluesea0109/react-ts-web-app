import { useQuery } from '@apollo/client';
import { Box, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Maybe } from '../../../utils/types';
import { botIconUploadQuery } from './gql';
import { IBotIconUploadUrlQueryResult } from './types';

const ImageUploader = ({ onImageUpload, isLoading, currentImage, label }: any) => {
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const { enqueueSnackbar } = useSnackbar();
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [file, setFile] = useState<Maybe<File>>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setIsFileLoading(true);
    setFile(e.target.files?.[0]);
  };

  useEffect(() => {
    if (!currentImage) {
      setFile(null);
    }
  }, [currentImage]);

  const imageUploadUrlQuery = useQuery<IBotIconUploadUrlQueryResult>(botIconUploadQuery, {
    variables: {
      agentId: numAgentId,
      basename: file?.name,
    },
    skip: !file,
  });

  useEffect(() => {
    if (!!file) {
      const url = imageUploadUrlQuery.data?.ChatbotService_botIconUploadUrl.url;

      if (!!url) {
        (async () => {
          try {
            await axios.put(url, file, {
              headers: {
                'Content-Type': file.type,
              },
            });

            const path = url.split('?')[0].split('/bot-icons/')[1];

            onImageUpload(path);
          } catch (e) {
            console.log(e);
            console.log(e.response);
            enqueueSnackbar('An error occurred while uploading image', { variant: 'error' });
          }

          setIsFileLoading(false);
        })();
      }
    }
    // eslint-disable-next-line
  }, [imageUploadUrlQuery.data]);

  const loading = isLoading || isFileLoading;

  return (
    <Box>
      <Box p={2}>
        <Box mb={2}>
          <Typography variant="h6">{label}</Typography>
        </Box>
        <Button
          disabled={loading}
          variant="contained"
          component="label"
          style={{ padding: 6 }}>
          {!file && !currentImage && 'Add Image'}
          {(!!file || (!!currentImage && currentImage !== '')) && 'Replace Image'}
          <input
            disabled={loading}
            name="image"
            id="image"
            accept="image/*"
            type="file"
            style={{ display: 'none' }}
            multiple={false}
            onChange={handleImageUpload}
          />
        </Button>
      </Box>
      {!!file && (
        <Box p={2}>
          <img src={URL.createObjectURL(file)} alt="" style={{ maxWidth: 400, maxHeight: 400, objectFit: 'contain' }} />
        </Box>
      )}
      {(!file && !!currentImage && currentImage !== '') && (
        <Box p={2}>
          <img src={currentImage} alt="" style={{ maxWidth: 400, maxHeight: 400, objectFit: 'contain' }} />
        </Box>
      )}
    </Box>
  );
};

export default ImageUploader;
