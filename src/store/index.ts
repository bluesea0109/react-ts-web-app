import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import { batchImageLabelingReducer } from './batch-image-labeling/reducers';
import { imageLabelingReducer } from './image-labeling/reducers';

const rootReducer = combineReducers({
  batchImageLabeling: batchImageLabelingReducer,
  imageLabeling: imageLabelingReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const middlewares = [thunkMiddleware];
  const middleWareEnhancer = applyMiddleware(...middlewares);

  const store = createStore(
    rootReducer,
    composeWithDevTools(middleWareEnhancer),
  );

  return store;
}
