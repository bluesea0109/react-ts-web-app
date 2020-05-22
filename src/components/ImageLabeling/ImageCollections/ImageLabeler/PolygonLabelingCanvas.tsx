import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as actions from '../../../../store/image-labeling/actions';
import ImageCategoricalLabel, {
  ImageLabelShapesEnum,
} from '../../models/labels/ImageLabel';
import MultiPolygon from '../../models/labels/MultiPolygon';

const mapDispatch = {
  updateLabel: actions.updateLabel,
  addLabel: actions.addLabel,
};

const connector = connect(null, mapDispatch);

interface IImageLabelerCanvasProps extends ConnectedProps<typeof connector> {
  labels: ImageCategoricalLabel[];
  selectedLabel: ImageCategoricalLabel | null;
  selectedLabelIndex: number | null;
  imageUrl: string;
  zoom: number;
}

interface IMousePos {
  x: number;
  y: number;
}

function ImageLabelerCanvas(props: IImageLabelerCanvasProps) {
  const { labels, selectedLabel, selectedLabelIndex, zoom } = props;

  interface IState {
    imgLoaded: boolean;
    mouseDownPos: IMousePos | null;
    mousePos: IMousePos | null;
  }

  const [state, setState] = useState<IState>({
    imgLoaded: false,
    mouseDownPos: null,
    mousePos: null,
  });

  useEffect(() => {
    draw();
  });

  const draw = () => {
    if (!state.imgLoaded) {
      return;
    }

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    drawImage();
    drawLabels();
  };

  const drawImage = () => {
    if (!state.imgLoaded) {
      return;
    }

    const zoom = props.zoom;
    const img = document.getElementById('image') as HTMLImageElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    const w = img.width * zoom;
    const h = img.height * zoom;
    canvas.width = w;
    canvas.height = h;
    ctx?.drawImage(img, 0, 0, w, h);
  };

  const drawLabels = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    for (const label of labels) {
      if (label.visible) {
        label.draw(ctx, zoom);
      }
    }
  };

  const getMousePos = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ): IMousePos => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  };

  const onCanvasClick = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    const mousePos = getMousePos(e);
    if (!selectedLabel || selectedLabelIndex === null) {
      const label = new ImageCategoricalLabel(
        null,
        ImageLabelShapesEnum.POLYGON,
        null,
        null,
        [],
      );
      (label.shape as MultiPolygon).addPoint([mousePos.x, mousePos.y]);
      props.addLabel(label);
    } else {
      const label = cloneDeep(selectedLabel);
      (label.shape as MultiPolygon).addPoint([mousePos.x, mousePos.y]);
      props.updateLabel(label, selectedLabelIndex);
    }
  };

  const onImageLoad = () => {
    setState({
      ...state,
      imgLoaded: true,
    });
  };

  return (
    <canvas id="canvas" onClick={onCanvasClick}>
      <img
        id="image"
        src={props.imageUrl}
        onLoad={onImageLoad}
        alt="to-label"
      />
    </canvas>
  );
}

export default connector(ImageLabelerCanvas);
