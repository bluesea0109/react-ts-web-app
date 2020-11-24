import {
  GraphPolicyNode,
  IUserImageOptionNode,
  UserImageOptionNode,
} from '@bavard/agent-config/dist/graph-policy-v2';
import { RichTextInput, ImageSelectorGrid } from '@bavard/react-components';

import { useLazyQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { Button, FormControl, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Alert, Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { IOptionImage } from '../../../models/chatbot-service';
import { uploadImageFile } from '../../../utils/file-uploads';
import { validateUrl } from '../../../utils/string';
import ContentLoading from '../../ContentLoading';
import { getOptionImagesQuery } from './gql';
import { getSignedImgUploadUrlQuery } from './gql';
import { IGetImageUploadSignedUrlQueryResult } from './types';
import { IGetOptionImagesQueryResult } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      display: 'flex',
      marginBottom: theme.spacing(2),
    },
  }),
);

interface IUpsertNodeFormProps {
  onSubmit?: (node: GraphPolicyNode) => void;
  nodeId: number;
  node?: IUserImageOptionNode;
  intents?: string[];
}
interface IParams {
  agentId: string;
}
export default function UpsertNodeForm({
  nodeId,
  node,
  intents,
  onSubmit,
}: IUpsertNodeFormProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState<string>();

  const [imageName, setImageName] = useState(node?.imageName || '');
  const [text, setText] = useState(node?.text || '');
  const [caption, setCaption] = useState(node?.caption || '');
  const [intent, setIntent] = useState(node?.intent || '');
  const [targetLink, setTargetLink] = useState(node?.targetLink || '');

  const [loading, setLoading] = useState(false);
  const [imgFile, setImgFile] = useState<File | undefined>(undefined);

  const [existingImg, setExistingImg] = useState<string | undefined>(
    node?.imageName || undefined,
  );

  const { agentId }: IParams = useParams();

  const imgQuery = useQuery<IGetOptionImagesQueryResult>(getOptionImagesQuery, {
    variables: { agentId: parseInt(agentId) },
  });

  const optionImages = imgQuery.data?.ChatbotService_optionImages || [];

  const [
    getSignedImgUploadUrl,
    signedImgUploadResult,
  ] = useLazyQuery<IGetImageUploadSignedUrlQueryResult>(
    getSignedImgUploadUrlQuery,
  );

  const prepareSignedUploadUrl = () => {
    if (imageName.length >= 1 && imgFile) {
      getSignedImgUploadUrl({
        variables: {
          agentId: parseInt(agentId),
          basename: imageName,
        },
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(prepareSignedUploadUrl, [optionImages]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(prepareSignedUploadUrl, [imgFile]);

  const submitUserImage = async () => {
    if (!text || !imageName) {
      return setError('Text, and Image Name are required fields');
    }

    if (targetLink && !validateUrl(targetLink)) {
      return setError('Target Link is an invalid url');
    }

    if (!imgFile && !existingImg) {
      return setError('Please select an image for the option');
    }

    // New image file has been selected
    if (!existingImg && imgFile) {
      const uploadUrl = signedImgUploadResult.data?.ChatbotService_imageOptionUploadUrl?.url.replace(
        /"/g,
        '',
      );
      // The upload url isn't ready. Wait for a few
      if (
        !uploadUrl ||
        uploadUrl.indexOf(encodeURIComponent(imageName)) === -1
      ) {
        enqueueSnackbar(
          'Image upload not ready. Please try in 10 seconds, or try a new image',
          { variant: 'error' },
        );
        prepareSignedUploadUrl();
        return;
      }

      try {
        setLoading(true);

        await uploadImageFile(imgFile, uploadUrl);

        imgQuery.refetch();

        setLoading(false);
      } catch (e) {
        enqueueSnackbar(
          `Error with uploading the image to GCS - ${JSON.stringify(e)}`,
          { variant: 'error' },
        );
      }
    }

    const newNode = new UserImageOptionNode(
      nodeId,
      imageName,
      text,
      caption,
      targetLink,
      intent,
    );

    onSubmit?.(newNode);
  };

  const handleNewImg = (file: File) => {
    setImgFile(file);
    setImageName(file.name);
    setExistingImg(undefined);
  };

  const handleSelectImg = (img: IOptionImage) => {
    setImageName(img.name);
    setExistingImg(img.name);
  };

  const renderSubmitButton = (submitFunc: () => void) => (
    <React.Fragment>
      {error && (
        <Alert className={classes.formControl} severity="error">
          {error}
        </Alert>
      )}
      <Button
        className={classes.formControl}
        onClick={submitFunc}
        variant="contained"
        color="primary">
        Submit
      </Button>
    </React.Fragment>
  );

  const formContent = (
    <React.Fragment>
      <FormControl variant="outlined" className={classes.formControl}>
        <React.Fragment>
          <ImageSelectorGrid
            onNewImg={handleNewImg}
            selectedImgName={imageName}
            images={optionImages}
            onSelect={handleSelectImg}
          />
        </React.Fragment>

        <RichTextInput
          label="Text"
          value={text}
          required={true}
          onChange={(value: string) => setText(value)}
        />
      </FormControl>
      <FormControl variant="outlined" className={classes.formControl}>
        <RichTextInput
          label="Caption"
          value={caption}
          onChange={(value: string) => setCaption(value)}
        />
      </FormControl>

      <TextField
        className={classes.formControl}
        name="imageName"
        value={imageName}
        size="small"
        required={true}
        label="Image Name"
        variant="outlined"
        disabled={true}
      />
      <TextField
        className={classes.formControl}
        name="targetLink"
        defaultValue={targetLink}
        label="Target Link"
        size="small"
        variant="outlined"
        onChange={(e) => setTargetLink(e.target.value as string)}
      />

      <Autocomplete
        className={classes.formControl}
        size="small"
        defaultValue={intent}
        freeSolo={true}
        options={(intents || []).map((option) => option)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Intent"
            margin="normal"
            variant="outlined"
            onChange={(e) => setIntent(e.target.value as string)}
          />
        )}
      />

      {/* <TextField
        className={classes.formControl}
        name="intent"
        defaultValue={intent}
        size="small"
        label="Intent"
        variant="outlined"
        onChange={(e) => setIntent(e.target.value as string)}
      /> */}
      {renderSubmitButton(submitUserImage)}
      {(loading || signedImgUploadResult.loading) && <ContentLoading />}
    </React.Fragment>
  );

  return <div>{formContent}</div>;
}
