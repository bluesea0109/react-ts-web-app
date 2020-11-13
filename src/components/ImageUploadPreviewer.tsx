import { Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import React, { useState } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    thumbnail: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: 0,
      border: 'none',
    },
    uploadButton: {
      width: '100%',
      height: '100%',
      borderRadius: 0,
    },
  }),
);

interface IImageUploadProps {
  onChange: (file: File) => void;
  width?: number;
  height?: number;
}

export default function ImageUpload({
  width,
  height,
  onChange,
}: IImageUploadProps) {
  const classes = useStyles();
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImgUrl(reader.result?.toString());
    };
    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
      onChange?.(e.target?.files[0]);
    }
  };

  return (
    <Button
      variant="contained"
      component="label"
      className={classes.uploadButton}>
      <img src={imgUrl} alt="" className={classes.thumbnail} />
      <Add />
      <input
        name="optionImg"
        id="optionImg"
        accept="image/*"
        type="file"
        style={{ display: 'none' }}
        multiple={false}
        onChange={handleImg}
      />
    </Button>
  );
}
