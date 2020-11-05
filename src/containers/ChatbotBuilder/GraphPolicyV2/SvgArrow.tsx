import React from 'react';

import { Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    arrow: {
      cursor: 'pointer',
    },
  }),
);

export interface ISvgArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  startElementId: number | string;
  endElementId: number | string;
  xBend?: number;
  yBend?: number;
  color?: string;
  strokeWidth?: number;
  arrowheadSize?: number;
}

const SvgArrow = ({
  x1,
  y1,
  x2,
  y2,
  startElementId,
  endElementId,
  xBend,
  yBend,
  color,
  strokeWidth,
  arrowheadSize,
}: ISvgArrowProps) => {
  const arrowColor = color || `#808080`;
  const headSize = arrowheadSize || 10;
  const classes = useStyles();
  const markerId = `arrow_${startElementId}_${endElementId}`;

  return (
    <React.Fragment>
      <defs>
        <marker
          className={classes.arrow}
          id={markerId}
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth={headSize}
          markerHeight={headSize}
          orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={arrowColor} />
        </marker>
      </defs>

      <polyline
        points={`${x1},${y1} ${
          xBend && yBend ? `${xBend},${yBend}` : ''
        } ${x2},${y2}`}
        fill="none"
        stroke={arrowColor}
        className={classes.arrow}
        strokeWidth={strokeWidth || 1}
        markerEnd={`url(#${markerId})`}
      />
    </React.Fragment>
  );
};

export default SvgArrow;
