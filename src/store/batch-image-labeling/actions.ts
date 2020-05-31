import { IImage, IImageLabelInput } from '../../models';
import { ADD_LABEL, BatchImageLabelingActionTypes, REMOVE_LABEL, RESET_LABELS, UPDATE_LABEL } from './types';

export function addLabel(imageId: number, label: IImageLabelInput): BatchImageLabelingActionTypes {
  return {
    type: ADD_LABEL,
    imageId,
    label,
  };
}

export function removeLabel(imageId: number, labelIndex: number): BatchImageLabelingActionTypes {
  return {
    type: REMOVE_LABEL,
    imageId,
    labelIndex,
  };
}

export function updateLabel(imageId: number, label: IImageLabelInput, labelIndex: number): BatchImageLabelingActionTypes {
  return {
    type: UPDATE_LABEL,
    imageId,
    label,
    labelIndex,
  };
}

export function resetLabels(images: IImage[]): BatchImageLabelingActionTypes {
  return {
    type: RESET_LABELS,
    images,
  };
}
