import {
  ADD_LABEL,
  ImageLabelingActionTypes,
  ImageLabelingState,
  REMOVE_LABEL,
  SELECT_LABEL,
  UPDATE_LABEL,
  RESET_LABELS,
} from './types';

const initialState: ImageLabelingState = {
  labels: [],
  selectedLabelIndex: null,
  deletedSavedLabels: false,
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

      return {
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
        labels: action.labels,
        selectedLabelIndex: null,
        deletedSavedLabels: false,
      };
    default:
      return state;
  }
}
