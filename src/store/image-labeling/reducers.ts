import {
  ADD_LABEL,
  ImageLabelingActionTypes,
  ImageLabelingState,
  REMOVE_LABEL,
  RESET_LABELS,
  SELECT_LABEL,
  UPDATE_LABEL,
} from './types';

const initialState: ImageLabelingState = {
  labels: [],
  selectedLabelIndex: null,
  deletedSavedLabels: false,
  deletedLabelIds: [],
};

export function imageLabelingReducer(
  state = initialState,
  action: ImageLabelingActionTypes,
): ImageLabelingState {
  switch (action.type) {
    case ADD_LABEL:
      return {
        ...state,
        labels: [...state.labels, action.label],
        selectedLabelIndex: state.labels.length,
      };
    case REMOVE_LABEL:

      let selectedLabelIndex = state.selectedLabelIndex;
      if (selectedLabelIndex !== null && state.selectedLabelIndex !== null) {
        if (state.selectedLabelIndex >= action.labelIndex) {
          selectedLabelIndex -= 1;
          if (selectedLabelIndex < 0) {
            selectedLabelIndex = null;
          }
        }
      }

      const deletedLabel = state.labels[action.labelIndex];

      const deletedLabelIds = [...state.deletedLabelIds];
      if (deletedLabel.id) {
        deletedLabelIds.push(deletedLabel.id);
      }

      return {
        deletedLabelIds,
        deletedSavedLabels: state.labels[action.labelIndex].id === null ? false : true,
        selectedLabelIndex,
        labels: [...state.labels.slice(0, action.labelIndex), ...state.labels.slice(action.labelIndex + 1)],
      };
    case UPDATE_LABEL:
      return {
        ...state,
        labels: [...state.labels.slice(0, action.labelIndex), action.label, ...state.labels.slice(action.labelIndex + 1)],
      };
    case SELECT_LABEL:
      return {
        ...state,
        selectedLabelIndex: action.labelIndex,
      };
    case RESET_LABELS:
      return {
        deletedLabelIds: [],
        labels: action.labels,
        selectedLabelIndex: null,
        deletedSavedLabels: false,
      };
    default:
      return state;
  }
}
