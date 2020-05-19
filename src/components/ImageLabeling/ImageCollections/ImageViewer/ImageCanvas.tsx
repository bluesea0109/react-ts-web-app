import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { useState } from 'react';
import ImageCategoricalLabel from '../../../../models/labels/ImageLabel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    canvasContainer: {
      // backgroundImage: "linear-gradient(to right, #757575 50%, #a4a4a4 50%), linear-gradient(to bottom, #757575 50%, #a4a4a4 50%)",
      // backgroundBlendMode: "difference, normal",
      // backgroundSize: "2em 2em",
      // overflow: 'auto',
      // flex: '1 1 auto',
      // height: 0
    },
  }),
);

interface IImageCanvasProps {
  imageUrl: string;
  labels: ImageCategoricalLabel[];
  zoom: number;
}

const ImageCanvas: React.FC<IImageCanvasProps> = (props) => {
  const { imageUrl, labels, zoom } = props;
  const classes = useStyles();
  const [state, setState] = useState({
    imageLoaded: false,
  });

  console.log('imageUrl', imageUrl);

  const drawLabels = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    for (const label of labels) {
      if (label.visible) {
        label.draw(ctx, zoom);
      }
    }
  };

  const handleImageLoad = () => {
    setState({
      ...state,
      imageLoaded: true,
    });
  };

  const drawImage = (canvas: HTMLCanvasElement) => {
    if (!state.imageLoaded) {
      return;
    }
    const img = document.getElementById('image') as HTMLImageElement;
    const ctx = canvas.getContext('2d');
    const w = img.width * zoom;
    const h = img.height * zoom;
    canvas.width = w;
    canvas.height = h;
    ctx?.drawImage(img, 0, 0, w, h);
  };

  const draw = () => {
    if (!state.imageLoaded) {
      return;
    }
    const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }
    console.log('drawing image');
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    drawImage(canvas);
    drawLabels(canvas);
  };

  draw();

  return (
    <div className={classes.canvasContainer}>
      <canvas id="imageCanvas">
        <img id="image" src={imageUrl} onLoad={handleImageLoad} alt="item" />
      </canvas>
    </div>
  );
};

export default ImageCanvas;
