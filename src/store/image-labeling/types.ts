import ImageCategoricalLabel from '../../containers/ImageLabeling/models/labels/ImageLabel';

export const ADD_LABEL = 'ADD_LABEL';
export const REMOVE_LABEL = 'REMOVE_LABEL';
export const UPDATE_LABEL = 'UPDATE_LABEL';
export const SELECT_LABEL = 'SELECT_LABEL';
export const RESET_LABELS = 'RESET_LABELS';

interface AddLabel {
  type: typeof ADD_LABEL;
  label: ImageCategoricalLabel;
}

interface RemoveLabel {
  type: typeof REMOVE_LABEL;
  labelIndex: number;
}

interface UpdateLabel {
  type: typeof UPDATE_LABEL;
  label: ImageCategoricalLabel;
  labelIndex: number;
}

interface SelectLabel {
  type: typeof SELECT_LABEL;
  labelIndex: number | null;
}

interface ResetLabels {
  type: typeof RESET_LABELS;
  labels: ImageCategoricalLabel[];
}

export interface ImageLabelingState {
  selectedLabelIndex: number | null;
  labels: ImageCategoricalLabel[];
  deletedSavedLabels: boolean;
  deletedLabelIds: number[];
}

export type ImageLabelingActionTypes =
  | AddLabel
  | RemoveLabel
  | UpdateLabel
  | SelectLabel
  | ResetLabels;
