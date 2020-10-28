import { GridList, GridListTile} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CheckCircle } from '@material-ui/icons';
import _ from 'lodash';
import React, {useState} from 'react';
import ImageUploadPreviewer from './ImageUploadPreviewer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridTile: {
      cursor: 'pointer',
    },
    selectedIcon: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1),
      color: theme.palette.secondary.light,
      backgroundColor: theme.palette.background.default,
      borderRadius: '50%',
    },
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
  }),
);

interface IImage {
  name: string;
  url: string;
}

interface ISelectorGridProps {
  imgWidth?: number;
  imgHeight?: number;
  images: IImage[];
  onSelect?: (image: IImage) => void;
  onNewImg: (file: File) => void;
  cols?: number;
  selectedImgName?: string;
}

export default function ImageSelectorGrid({
  cols= 4,
  images,
  imgWidth,
  selectedImgName,
  onSelect,
  onNewImg,
}: ISelectorGridProps) {
  const classes = useStyles();
  const [selectedImg, selectImg] = useState<IImage|undefined>(
    selectedImgName ?
    _.find(images, { name: selectedImgName })
    :
    undefined,
  );
  const [newImg, setNewImg] = useState<File|undefined>(undefined);

  const handleNewImg = (file: File) => {
    setNewImg(file);
    selectImg(undefined);
    onNewImg(file);
  };

  return (
    <GridList cellHeight={imgWidth || 100} cols={cols || 4}>
      <GridListTile className={classes.gridTile} key={'new_img'} onClick={() => {selectImg(undefined); }}>
        <ImageUploadPreviewer onChange={handleNewImg} width={imgWidth} />
        { (!selectedImg && newImg) && <CheckCircle className={classes.selectedIcon}/>}
      </GridListTile>

      {images.map((img) => {
        return (
          <GridListTile className={classes.gridTile} key={img.name} onClick={() => {selectImg(img); onSelect?.(img); }}>
            <img alt={img.name} src={img.url}/>
            { (selectedImg?.name === img.name) && <CheckCircle className={classes.selectedIcon}/>}
          </GridListTile>
        );
      })}
    </GridList>
  );
}
