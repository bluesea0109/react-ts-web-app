import {
  CanvasActionTypes,
  CanvasState,
  MOUSE_DOWN,
  MOUSE_MOVE,
  MOUSE_UP,
} from './types';

const initialState: CanvasState = {
  mouseDown: false,
  mouseDownPosition: null,
  mousePosition: null,
};

export function canvasReducer(
  state = initialState,
  action: CanvasActionTypes,
): CanvasState {
  switch (action.type) {
    case MOUSE_DOWN:
      return {
        ...state,
        mouseDown: true,
        mouseDownPosition: action.payload,
        mousePosition: action.payload,
      };
    case MOUSE_UP:
      return {
        ...state,
        mouseDown: false,
        mouseDownPosition: null,
      };
    case MOUSE_MOVE:
      return {
        ...state,
        mousePosition: action.payload,
      };
    default:
      return state;
  }
}
