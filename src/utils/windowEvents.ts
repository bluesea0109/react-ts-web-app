import { EKeyboardCmd } from './types';

export const getAction = (event: KeyboardEvent): EKeyboardCmd | undefined => {
  const key = event.key.toLowerCase();
  let cmd: EKeyboardCmd | undefined;

  switch (key) {
    case 'backspace': {
      cmd = EKeyboardCmd.DELETE;
      break;
    }
    case 'delete': {
      cmd = EKeyboardCmd.DELETE;
      break;
    }
    case 'arrowright': {
      cmd = EKeyboardCmd.MOVERIGHT;
      break;
    }
    case 'arrowleft': {
      cmd = EKeyboardCmd.MOVELEFT;
      break;
    }
    case 'arrowup': {
      cmd = EKeyboardCmd.MOVEUP;
      break;
    }
    case 'arrowdown': {
      cmd = EKeyboardCmd.MOVEDOWN;
      break;
    }
  }

  if (cmd) {
    return cmd;
  }

  if (!event.ctrlKey && !event.metaKey) {
    return;
  }

  if (key === 'c') {
    cmd = EKeyboardCmd.COPY;
  } else if (key === 'v') {
    cmd = EKeyboardCmd.PASTE;
  } else if (event.shiftKey && key === 'z') {
    cmd = EKeyboardCmd.REDO;
  } else if (!event.shiftKey && key === 'z') {
    cmd = EKeyboardCmd.UNDO;
  } else if (key === 's') {
    cmd = EKeyboardCmd.SAVE;
  }

  return cmd;
};
