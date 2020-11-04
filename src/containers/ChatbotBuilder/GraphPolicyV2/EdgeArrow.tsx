import React from 'react';
import SvgArrow, { ISvgArrowProps } from './SvgArrow';
import { Theme } from '@material-ui/core';

import { createStyles, makeStyles } from '@material-ui/styles';

interface IEdgeArrowProps extends ISvgArrowProps {
  startNodeId: number;
  endNodeId: number;
  onLineClick?: (
    event: React.MouseEvent<SVGPolylineElement, MouseEvent>
  ) => void;
  onMouseOver?: (
    event: React.MouseEvent<SVGPolylineElement, MouseEvent>
  ) => void;
  onMouseOut?: (
    event: React.MouseEvent<SVGPolylineElement, MouseEvent>
  ) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    lineClickArea: {
      cursor: 'pointer',
      stroke: 'transparent',
      '&:hover': {
        stroke: 'rgba(0,0,0,.1)',
      },
    },
    lineHoverArea: {
      stroke: 'transparent',
    },
    deleteIcon: {
      color: theme.palette.error.main,
    },
  })
);

const EdgeArrow = (props: IEdgeArrowProps) => {
  const classes = useStyles();
  const { startNodeId, endNodeId, ...arrowProps } = props;
  const { x1, y1, xBend, yBend, x2, y2 } = arrowProps;

  return (
    <React.Fragment>
      <g onClick={props.onLineClick}>
        <SvgArrow {...arrowProps} />
        <polyline
          onMouseOver={props.onMouseOver}
          onMouseOut={props.onMouseOut}
          className={classes.lineHoverArea}
          points={`${x1},${y1} ${
            xBend && yBend ? `${xBend},${yBend}` : ''
          } ${x2},${y2}`}
          fill="none"
          strokeWidth={40}
        />
        <polyline
          className={classes.lineClickArea}
          points={`${x1},${y1} ${
            xBend && yBend ? `${xBend},${yBend}` : ''
          } ${x2},${y2}`}
          fill="none"
          strokeWidth={10}
        />
      </g>
    </React.Fragment>
  );
};

export default EdgeArrow;
