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
      event.preventDefault();
      cmd = EKeyboardCmd.MOVERIGHT;
      break;
    }
    case 'arrowleft': {
      event.preventDefault();
      cmd = EKeyboardCmd.MOVELEFT;
      break;
    }
    case 'arrowup': {
      event.preventDefault();
      cmd = EKeyboardCmd.MOVEUP;
      break;
    }
    case 'arrowdown': {
      event.preventDefault();
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
  } else if (key === 'z') {
    event.preventDefault();
    cmd = EKeyboardCmd.UNDO;
  } else if (key === 'y') {
    event.preventDefault();
    cmd = EKeyboardCmd.REDO;
  }

  return cmd;
};
