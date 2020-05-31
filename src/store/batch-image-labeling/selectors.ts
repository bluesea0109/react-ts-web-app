import { AppState } from '..';

export const getBatchImageLabels = (store: AppState) => store.batchImageLabeling.imageLabels;
