import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import * as actions from '../../../../store/image-labeling/actions';
import ImageCategoricalLabel from '../../models/labels/ImageLabel';
import MultiRectangle from '../../models/labels/MultiRectangle';
import shape from '@material-ui/core/styles/shape';

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
  const { labels, selectedLabel, selectedLabelIndex, zoom, updateLabel } = props;

  console.log('labels', labels);
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
    if (!canvas) { return; }

    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    drawImage();
    drawLabels();
  };

  const drawImage = () => {
    if (!state.imgLoaded) { return; }

    const zoom = props.zoom;
    const img = document.getElementById('image') as HTMLImageElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) { return; }

    const ctx = canvas.getContext('2d');
    const w = img.width * zoom;
    const h = img.height * zoom;
    canvas.width = w;
    canvas.height = h;
    ctx?.drawImage(img, 0, 0, w, h);
  };

  const drawLabels = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) { return; }

    const ctx = canvas.getContext('2d');

    for (const label of labels) {
      if (label.visible) {
        label.draw(ctx, zoom);
      }
    }
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): IMousePos => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left),
      y: (e.clientY - rect.top),
    };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setState({
      ...state,
      mouseDownPos: getMousePos(e),
    });
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    console.log('mouse up');

    setState({
      ...state,
      mouseDownPos: null,
      mousePos: null,
    });

    if (!selectedLabel || selectedLabelIndex === null) {
      return;
    }
    console.log('test');

    if (selectedLabel.shape instanceof MultiRectangle && selectedLabel.shape.isRectangleStarted()) {
      const label =  cloneDeep(selectedLabel);
      (label.shape as MultiRectangle).endRectangle();
      props.updateLabel(label, selectedLabelIndex);
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!selectedLabel || selectedLabelIndex === null) {

      if (state.mouseDownPos) {
        props.addLabel(new ImageCategoricalLabel(null, 'box', null, null, []));
      }
      return;
    }

    const label =  cloneDeep(selectedLabel);

    const shape = label.shape;
    if (!(shape instanceof MultiRectangle)) {
      return;
    }

    if (state.mouseDownPos) {
      const mousePos = getMousePos(e);

      const width = mousePos.x - state.mouseDownPos.x;
      const height = mousePos.y - state.mouseDownPos.y;

      const rect = [state.mouseDownPos.x, state.mouseDownPos.y, width, height];
      const [x, y, w, h] = rect;
      if (!shape.isRectangleStarted()) {
        shape.startRectangle(x, y, w, h);
      } else {
        console.log('updating label');
        shape.updateCurrentRectangle(x, y, w, h);
      }
      label.modified = true;
      updateLabel(label, selectedLabelIndex);
    }
  };

  const onImageLoad = () => {
    setState({
      ...state,
      imgLoaded: true,
    });
  };

  return (
    <canvas id="canvas" onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
      <img id="image" src={props.imageUrl} onLoad={onImageLoad} alt="to-label" />
    </canvas>
  );
}

export default connector(ImageLabelerCanvas);
