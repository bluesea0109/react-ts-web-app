import { IImage, IImageLabelInput } from '../../models';

export const ADD_LABEL = 'ADD_LABEL';
export const REMOVE_LABEL = 'REMOVE_LABEL';
export const UPDATE_LABEL = 'UPDATE_LABEL';
export const SELECT_LABEL = 'SELECT_LABEL';
export const RESET_LABELS = 'RESET_LABELS';

interface AddLabel {
  type: typeof ADD_LABEL;
  imageId: number;
  label: IImageLabelInput;
}

interface RemoveLabel {
  type: typeof REMOVE_LABEL;
  imageId: number;
  labelIndex: number;
}

interface UpdateLabel {
  type: typeof UPDATE_LABEL;
  imageId: number;
  label: IImageLabelInput;
  labelIndex: number;
}

interface ResetLabels {
  type: typeof RESET_LABELS;
  images: IImage[];
}

export interface BatchImageLabelingState {
  imageLabels: Map<number, IImageLabelInput[]>;
}

export type BatchImageLabelingActionTypes = AddLabel | RemoveLabel | UpdateLabel | ResetLabels;
