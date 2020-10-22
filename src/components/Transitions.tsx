import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import React from 'react';
import { DirectionType } from './types';

const Transition = (direction: DirectionType) => React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction={direction} ref={ref} {...props} />;
});

export const RightTransition = Transition('right');
export const LeftTransition = Transition('left');
export const UpTransition = Transition('up');
export const DownTransition = Transition('down');
