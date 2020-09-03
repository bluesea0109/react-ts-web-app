import { Box, Slider, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ColorResult, SketchPicker } from 'react-color';

export interface IGradientPickerProps {
  color: string;
  label?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    card: {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(2),
    },
  }),
);

// const GradientMap = {
//   linear: {
//     top: {
//       '-moz-linear-gradient': 'top',
//       '-webkit-linear-gradient': 'top',
//       'linear-gradient': 'to bottom',
//     },
//     left: {
//       '-moz-linear-gradient': 'left',
//       '-webkit-linear-gradient': 'left',
//       'linear-gradient': 'to right',
//     },
//     '-45deg': {
//       '-moz-linear-gradient': '-45deg',
//       '-webkit-linear-gradient': '-45deg',
//       'linear-gradient': '135deg',
//     },
//     '45deg': {
//       '-moz-linear-gradient': '45deg',
//       '-webkit-linear-gradient': '45deg',
//       'linear-gradient': '45deg',
//     },
//   },
// };

interface IGradientPoint {
  position: number;
  color: {
    r: number;
    g: number;
    b: number;
    a?: number;
  };
}

interface IGradientSpec {
  direction:
    | 'to bottom'
    | 'to right'
    | '135deg'
    | '45deg'
    | 'ellipse at center';
  points: IGradientPoint[];
}

const DEFAULT_GRADIENT: IGradientSpec = {
  direction: 'to bottom',
  points: [
    {
      position: 0,
      color: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      },
    },
    {
      position: 100,
      color: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      },
    },
  ],
};

const GradientPicker = ({ color, label }: IGradientPickerProps) => {
  const classes = useStyles();

  const [sliderPositions, setSliderPositions] = useState<number[]>([]);
  const [editingPoint, setEditingPoint] = useState<number | undefined>();
  const [gradient, setGradient] = useState(DEFAULT_GRADIENT);

  useEffect(() => {
    console.log('GRADIENT CHANGED: ', gradient);
  });

  const setColor = (color?: ColorResult, pointIndex?: number) => {
    console.log(color, pointIndex);
    if (!((pointIndex as number) >= 0)) {
      return;
    }

    let rgb = color?.rgb;
    if (!rgb) {
      rgb = gradient.points[pointIndex as number].color;
    }

    const point: IGradientPoint = {
      position: sliderPositions[pointIndex as number],
      color: rgb,
    };

    console.log('POINT: ', pointIndex, point);

    const newPoints = gradient.points.map((p, index) => {
      if (index === pointIndex) {
        p = point;
      }
      return p;
    });

    setGradient({
      direction: gradient.direction,
      points: newPoints,
    });
  };

  const rgbaFromGradientPoint = (point: IGradientPoint) => {
    return `rgba(${point.color.r},${point.color.g},${point.color.b},${
      point.color.a || 1
    })`;
  };

  const gradientToCss = (gradient: IGradientSpec) => {
    console.log(gradient);
    let browserParam = 'linear-gradient';
    if (gradient.direction === 'ellipse at center') {
      browserParam = 'radial-gradient';
    }

    const pointsStr = gradient.points.map((p) => {
      return `${rgbaFromGradientPoint(p)} ${p.position}%`;
    });

    const css = `${browserParam}(${gradient.direction}, ${pointsStr.join(
      ', ',
    )})`;

    console.log('CSS: ', css);
    return css;
  };

  const handleSliderChange = (event: any, value: any) => {
    console.log(value);
    const previousPositions = sliderPositions;
    setSliderPositions(value as number[]);

    let changedIndex = -1;
    _.each(previousPositions, (pos: number, index: number) => {
      if (pos !== value[index]) {
        changedIndex = index;
      }
    });

    setEditingPoint(changedIndex);
    setColor(undefined, changedIndex);
  };

  return (
    <div className={classes.root}>
      <Typography variant="subtitle1">{label}</Typography>
      <Box
        mt={2}
        width="100%"
        height={100}
        style={{
          background: gradientToCss(gradient),
        }}
      />
      <Slider
        track={false}
        onChangeCommitted={handleSliderChange}
        defaultValue={_.map(gradient.points, 'position') || []}
      />

      <Box mt={5} mb={1} mx="auto">
        {(editingPoint as number) >= 0 && (
          <SketchPicker
            color={rgbaFromGradientPoint(
              gradient.points[editingPoint as number],
            )}
            onChange={(newColor) => setColor(newColor, editingPoint)}
          />
        )}
      </Box>
    </div>
  );
};

export default GradientPicker;
