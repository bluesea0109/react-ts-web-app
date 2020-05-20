export const MOUSE_DOWN = 'MOUSE_DOWN';
export const MOUSE_UP = 'MOUSE_UP';
export const MOUSE_MOVE = 'MOUSE_MOVE';

interface MouseDownAction {
  type: typeof MOUSE_DOWN;
  payload: MousePosition;
}

interface MouseUpAction {
  type: typeof MOUSE_UP;
}

interface MouseMoveAction {
  type: typeof MOUSE_MOVE;
  payload: MousePosition;
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface CanvasState {
  mouseDown: boolean;
  mouseDownPosition: MousePosition | null;
  mousePosition: MousePosition | null;
}

export type CanvasActionTypes = MouseDownAction | MouseUpAction | MouseMoveAction;
