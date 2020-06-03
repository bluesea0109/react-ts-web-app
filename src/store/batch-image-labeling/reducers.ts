import { cloneDeep } from 'lodash';
import { IBatchLabelingInput } from '../../models';
import {
  ADD_LABEL,
  BatchImageLabelingActionTypes,
  BatchImageLabelingState,
  REMOVE_LABEL,
  RESET_LABELS,
  UPDATE_LABEL,
} from './types';

const initialState: BatchImageLabelingState = {
  imageLabels: new Map<number, IBatchLabelingInput[]>(),
};

export function batchImageLabelingReducer(
  state = initialState,
  action: BatchImageLabelingActionTypes,
): BatchImageLabelingState {
  let imageLabels = cloneDeep(state.imageLabels);

  switch (action.type) {
    case ADD_LABEL: {
      const labels = imageLabels.get(action.imageId) || [];
      labels.push(cloneDeep(action.label));
      imageLabels.set(action.imageId, labels);
      return {
        imageLabels,
      };
    }
    case REMOVE_LABEL: {
      const idx = action.labelIndex;
      let labels = imageLabels.get(action.imageId) || [];
      labels = [...labels.slice(0, idx), ...labels.slice(idx + 1)];
      imageLabels.set(action.imageId, labels);
      return {
        imageLabels,
      };
    }
    case UPDATE_LABEL: {
      const idx = action.labelIndex;
      const labels = imageLabels.get(action.imageId) || [];
      labels[idx] = cloneDeep(action.label);
      imageLabels.set(action.imageId, labels);
      return {
        imageLabels,
      };
    }
    case RESET_LABELS: {
      imageLabels = new Map<number, IBatchLabelingInput[]>();
      action.images.forEach(img => {
        const labelInputs: IBatchLabelingInput[] = [];
        img.labels.forEach(label => {
          if (label.category) {
            labelInputs.push({
              imageId: img.id,
              categorySetId: label.category.categorySetId,
              category: label.category.name,
            });
          }
        });
        imageLabels.set(img.id, labelInputs);
      });
      return {
        imageLabels,
      };
    }
    default:
      return state;
  }
}
