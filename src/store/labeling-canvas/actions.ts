import { CanvasActionTypes, MousePosition, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP } from './types';

export function mouseDown(pos: MousePosition): CanvasActionTypes {
  return {
    type: MOUSE_DOWN,
    payload: pos,
  };
}

export function mouseUp(): CanvasActionTypes {
  return {
    type: MOUSE_UP,
  };
}

export function mouseMove(pos: MousePosition): CanvasActionTypes {
  return {
    type: MOUSE_MOVE,
    payload: pos,
  };
}
