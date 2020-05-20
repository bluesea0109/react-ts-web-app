import ImageCategoricalLabel from '../../components/ImageLabeling/models/labels/ImageLabel';
import { ADD_LABEL, ImageLabelingActionTypes, REMOVE_LABEL, UPDATE_LABEL, SELECT_LABEL, RESET_LABELS } from './types';

export function addLabel(label: ImageCategoricalLabel): ImageLabelingActionTypes {
  return {
    type: ADD_LABEL,
    label,
  };
}

export function removeLabel(labelIndex: number): ImageLabelingActionTypes {
  return {
    type: REMOVE_LABEL,
    labelIndex,
  };
}

export function updateLabel(label: ImageCategoricalLabel, labelIndex: number): ImageLabelingActionTypes {
  return {
    type: UPDATE_LABEL,
    label,
    labelIndex,
  };
}

export function selectLabel(labelIndex: number): ImageLabelingActionTypes {
  return {
    type: SELECT_LABEL,
    labelIndex,
  };
}

export function resetLabels(labels: ImageCategoricalLabel[]): ImageLabelingActionTypes {
  return {
    type: RESET_LABELS,
    labels,
  };
}
