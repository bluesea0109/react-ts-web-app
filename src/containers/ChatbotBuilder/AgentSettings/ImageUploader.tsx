import { useQuery } from '@apollo/client';
import { Box } from '@material-ui/core';
import { Link } from '@material-ui/core';
import axios from 'axios';
import FileType from 'file-type';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Maybe } from '../../../utils/types';
import { botIconUploadQuery } from './gql';
import { IBotIconUploadUrlQueryResult } from './types';

const ImageUploader = ({
  onImageUpload,
  isLoading,
  currentImage,
  label,
  iconType,
}: any) => {
  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);

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

  const imageUploadUrlQuery = useQuery<IBotIconUploadUrlQueryResult>(
    botIconUploadQuery,
    {
      variables: {
        iconType,
        agentId,
      },
      skip: !file,
    },
  );

  useEffect(() => {
    if (file) {
      const url = imageUploadUrlQuery.data?.ChatbotService_botIconUploadUrl.url;
      if (url) {
        (async () => {
          try {
            const fileType = await FileType.fromBuffer(
              await file.arrayBuffer(),
            );
            await axios.put(url, file, {
              headers: {
                'Content-Type': fileType?.mime,
                'Access-Control-Allow-Origin': '*',
              },
            });

            const path = url.split('?')[0].split('/bot-icons/')[1];

            onImageUpload(path);
          } catch (e) {
            enqueueSnackbar('An error occurred while uploading image', {
              variant: 'error',
            });
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
        {!!file && (
          <Box p={2}>
            <img
              src={URL.createObjectURL(file)}
              alt=""
              style={{ width: 100, height: 100, objectFit: 'cover' }}
            />
          </Box>
        )}
        {!file && !!currentImage && currentImage !== '' && (
          <Box p={2}>
            <img
              src={currentImage}
              alt=""
              style={{ width: 100, height: 100, objectFit: 'cover' }}
            />
          </Box>
        )}
      </Box>

      {/* <Box mb={2}>
          <Typography variant="subtitle1">{label}</Typography>
        </Box> */}
      <Link component="label">
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
        {!file && !currentImage && 'Add Image'}
        {(!!file || (!!currentImage && currentImage !== '')) &&
          'Upload a Different Image'}
      </Link>
    </Box>
  );
};

export default ImageUploader;
