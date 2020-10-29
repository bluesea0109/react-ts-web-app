import { useLazyQuery } from '@apollo/client';
import { IImageOption } from '@bavard/agent-config';
import React, { useContext, useState } from 'react';
import { ImageSelectorGrid } from '../../../components';
import { OptionImagesContext } from '../../../context/OptionImages';
import { IOptionImage } from '../../../models/chatbot-service';

interface OptionImageUploaderProps {
  option: IImageOption;
}

const OptionImageUploader = ({
  option,
}: OptionImageUploaderProps) => {
  const [imgFile, setImgFile] = useState<File | undefined>(undefined);
  const [imageName, setImageName] = useState((option as IImageOption).imageName || '');
  const [existingImg, setExistingImg] = useState<string | undefined>(
    (option as IImageOption).imageName || undefined,
  );

  const optionImages = useContext(OptionImagesContext)?.optionImages || [];

  const handleNewImg = (file: File) => {
    setImgFile(file);
    setImageName(file.name);
    setExistingImg(undefined);
  };

  const handleSelectImg = (img: IOptionImage) => {
    setImageName(img.name);
    setExistingImg(img.name);
  };

  return (
    <ImageSelectorGrid
      onNewImg={handleNewImg}
      selectedImgName={imageName}
      images={optionImages}
      onSelect={handleSelectImg}
    />
  );
};

export default OptionImageUploader;
