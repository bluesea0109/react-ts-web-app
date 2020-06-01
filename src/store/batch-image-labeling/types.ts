import { IBatchLabelingInput, IImage } from '../../models';

export const ADD_LABEL = 'BATCH/ADD_LABEL';
export const REMOVE_LABEL = 'BATCH/REMOVE_LABEL';
export const UPDATE_LABEL = 'BATCH/UPDATE_LABEL';
export const SELECT_LABEL = 'BATCH/SELECT_LABEL';
export const RESET_LABELS = 'BATCH/RESET_LABELS';

interface AddLabel {
  type: typeof ADD_LABEL;
  imageId: number;
  label: IBatchLabelingInput;
}

interface RemoveLabel {
  type: typeof REMOVE_LABEL;
  imageId: number;
  labelIndex: number;
}

interface UpdateLabel {
  type: typeof UPDATE_LABEL;
  imageId: number;
  label: IBatchLabelingInput;
  labelIndex: number;
}

interface ResetLabels {
  type: typeof RESET_LABELS;
  images: IImage[];
}

export interface BatchImageLabelingState {
  imageLabels: Map<number, IBatchLabelingInput[]>;
}

export type BatchImageLabelingActionTypes = AddLabel | RemoveLabel | UpdateLabel | ResetLabels;
