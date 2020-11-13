import Button from '@material-ui/core/Button';
import { cloneDeep } from 'lodash';
import React from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import * as actions from '../../../../store/image-labeling/actions';
import {
  getSelectedLabel,
  getSelectedLabelIndex,
} from '../../../../store/image-labeling/selectors';
import { ImageLabelShapesEnum } from '../../models/labels/ImageLabel';
import MultiPolygon from '../../models/labels/MultiPolygon';

const mapDispatch = {
  updateLabel: actions.updateLabel,
};

const connector = connect(null, mapDispatch);

const ClosePolygonButton: React.FC<ConnectedProps<typeof connector>> = (
  props,
) => {
  const selectedLabel = useSelector(getSelectedLabel);
  const selectedLabelIndex = useSelector(getSelectedLabelIndex);

  if (
    !selectedLabel ||
    selectedLabel.shapeType !== ImageLabelShapesEnum.POLYGON
  ) {
    return null;
  }

  const closePolygonDisabled = () => {
    if (!selectedLabel) {
      return;
    }

    if (selectedLabel?.shapeType !== ImageLabelShapesEnum.POLYGON) {
      return true;
    }

    const multipoly = selectedLabel.shape as MultiPolygon;
    return !(
      multipoly.currentPolygon && multipoly.currentPolygon.points.length > 2
    );
  };

  const closePolygon = () => {
    if (!selectedLabel || selectedLabelIndex === null) {
      return;
    }
    const label = cloneDeep(selectedLabel);
    const poly = label.shape as MultiPolygon;
    poly.endPolygon();
    props.updateLabel(label, selectedLabelIndex);
  };

  return (
    <Button disabled={closePolygonDisabled()} onClick={closePolygon}>
      {'Close Polygon'}
    </Button>
  );
};

export default connector(ClosePolygonButton);
