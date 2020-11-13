import { AppState } from '..';

export const getImageLabelingState = (store: AppState) => store.imageLabeling;

export const getLabels = (store: AppState) => store.imageLabeling.labels;

export const getSelectedLabel = (store: AppState) => {
  if (store.imageLabeling.selectedLabelIndex !== null) {
    return store.imageLabeling.labels[store.imageLabeling.selectedLabelIndex];
  }
  return null;
};

export const getSelectedLabelIndex = (store: AppState) => {
  return store.imageLabeling.selectedLabelIndex;
};

export const deletedSavedLabels = (store: AppState) => {
  return store.imageLabeling.deletedSavedLabels;
};
