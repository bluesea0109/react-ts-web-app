import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Slider,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import {
  Add,
  AllOut,
  ArrowDownward,
  ArrowForward,
  CallMade,
  CallReceived,
  Delete,
  Edit,
} from '@material-ui/icons';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ColorResult, SketchPicker } from 'react-color';

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
    textField: {
      width: '100%',
    },
    point: {
      width: 10,
      height: 10,
      top: 9,
      position: 'absolute',
      boxShadow: '0px 0px 2px 1px #999',
      zIndex: 1,
    },
    relativeContainer: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    paper: {
      padding: theme.spacing(2),
      position: 'relative',
      width: '100%',
    },
    editCssIcon: {
      position: 'absolute',
      top: 5,
      right: 5,
    },
    thumbIcon: {
      position: 'absolute',
      fontSize: 15,
      zIndex: 2,
      color: theme.palette.grey[500],
    },
    addButton: {
      position: 'absolute',
      bottom: 5,
      left: 'calc(50% - 20px)',
      backgroundColor: 'rgba(255,255,255,.7)',
      color: theme.palette.grey[500],
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,1)',
      },
    },
    gradientTypeButton: {
      position: 'absolute',
      left: 5,
      top: 5,
      backgroundColor: 'rgba(255,255,255,.7)',
      color: theme.palette.grey[500],
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,1)',
      },
    },
    sketchPicker: {},
  }),
);

interface IGradientPoint {
  position: number;
  color: {
    r: number;
    g: number;
    b: number;
    a?: number;
  };
}

type GradientDirection =
  | 'to bottom'
  | 'to right'
  | '135deg'
  | '45deg'
  | 'ellipse at center';

interface IGradientSpec {
  direction: GradientDirection;
  points: IGradientPoint[];
}

export interface IGradient {
  gradient: IGradientSpec;
  cssBackground: string;
}

const BLACK = {
  r: 0,
  g: 0,
  b: 0,
  a: 1,
};

const DEFAULT_GRADIENT: IGradientSpec = {
  direction: 'to bottom',
  points: [
    {
      position: 0,
      color: {
        r: 0,
        g: 0,
        b: 0,
        a: 0.1,
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

const directionIconMap = {
  'to bottom': <ArrowDownward />,
  'to right': <ArrowForward />,
  '45deg': <CallMade />,
  '135deg': <CallReceived />,
  'ellipse at center': <AllOut />,
};

const GradientSlider = withStyles({
  rail: {
    opacity: 0.1,
  },
  track: {
    opacity: 0.1,
  },
})(Slider);

export interface IGradientPickerProps {
  defaultValue?: string;
  label?: string;
  onChange?: (result: IGradient) => void;
}

const GradientPicker = ({
  defaultValue,
  label,
  onChange,
}: IGradientPickerProps) => {
  const classes = useStyles();

  const gradientToCss = (gradient: IGradientSpec) => {
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

    cssToGradient(css);

    return css;
  };

  const cssToGradient = (css: string) => {
    const direction = css.split('(')[1]?.split(',')[0] as GradientDirection;
    const rgbas = css.split('rgba(');
    rgbas.shift();

    const points = rgbas.map((rgba: string) => {
      const position = parseInt(rgba.split(/[ %]+/)[1]);
      const split = rgba.split(',');

      const point: IGradientPoint = {
        position,
        color: {
          r: parseInt(split[0]),
          g: parseInt(split[1]),
          b: parseInt(split[2]),
          a: parseInt(split[3]),
        },
      };
      return point;
    });

    const result: IGradientSpec = {
      direction,
      points,
    };

    return result;
  };

  const [gradient, setGradient] = useState(
    defaultValue ? cssToGradient(defaultValue) : DEFAULT_GRADIENT,
  );
  const [editingPoint, setEditingPoint] = useState<number | undefined>();
  const [gradientTypesMenu, showGradientTypesMenu] = useState(false);
  const [gradientTypesAnchor, setAnchor] = useState<null | HTMLElement>(null);
  const [editingCss, setEditingCss] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setGradient(cssToGradient(defaultValue));
    }
  }, [defaultValue]);

  useEffect(() => {
    onChange?.({
      gradient,
      cssBackground: gradientToCss(gradient),
    });
    // eslint-disable-next-line
  }, [gradient]);

  const setColor = (color?: ColorResult, pointIndex?: number) => {
    if (!((pointIndex as number) >= 0)) {
      return;
    }

    let rgb = color?.rgb;
    if (!rgb) {
      rgb = gradient.points[pointIndex as number].color;
    }

    const sliderPositions = _.map(gradient.points, 'position') || [];

    const point: IGradientPoint = {
      position: sliderPositions[pointIndex as number],
      color: rgb,
    };

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

  const addNewPoint = () => {
    const newPoint: IGradientPoint = {
      position: 50,
      color: BLACK,
    };

    const points = gradient.points;
    const newPointIndex = Math.round(points.length / 2);
    points.splice(newPointIndex, 0, newPoint);

    const newGradient = {
      direction: gradient.direction,
      points,
    };

    setGradient(newGradient);
    setEditingPoint(newPointIndex);
  };

  const deletePoint = (position: number) => {
    const points = _.filter(gradient.points, (p, index) => {
      return index !== position;
    });

    setGradient({
      direction: gradient.direction,
      points,
    });
  };

  const rgbaFromGradientPoint = (point: IGradientPoint) => {
    return `rgba(${point.color.r},${point.color.g},${point.color.b},${
      point.color.a || 1
    })`;
  };

  const setGradientDirection = (value: GradientDirection) => {
    const newGradient = gradient;
    newGradient.direction = value;
    setGradient(newGradient);
    showGradientTypesMenu(false);
  };

  const handleSliderChange = (event: any, newPositions: any) => {
    const newGradient = gradient;

    newGradient.points = gradient.points.map((p, index) => {
      if (p.position !== newPositions[index]) {
        p.position = newPositions[index];
      }
      return p;
    });

    setGradient(newGradient);
    setColor(undefined, editingPoint);
  };

  return (
    <div className={classes.root}>
      <Typography variant="subtitle1">{label}</Typography>
      <Box
        mt={2}
        width="100%"
        height={100}
        className={classes.relativeContainer}
        style={{
          background: gradientToCss(gradient),
        }}>
        <Tooltip title="Add a color stop">
          <IconButton
            className={classes.addButton}
            size="small"
            onClick={addNewPoint}>
            <Add />
          </IconButton>
        </Tooltip>

        <Tooltip title="Gradient Direction">
          <IconButton
            className={classes.gradientTypeButton}
            size={'small'}
            onClick={(e) => {
              showGradientTypesMenu(true);
              setAnchor(e.currentTarget);
            }}>
            {directionIconMap[gradient.direction]}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={gradientTypesAnchor}
          keepMounted={true}
          open={gradientTypesMenu}
          onClose={() => showGradientTypesMenu(false)}>
          <MenuItem
            key={'to bottom'}
            selected={false}
            onClick={() => setGradientDirection('to bottom')}>
            Vertical
          </MenuItem>
          <MenuItem
            key={'to right'}
            selected={false}
            onClick={() => setGradientDirection('to right')}>
            Horizontal
          </MenuItem>
          <MenuItem
            key={'45deg'}
            selected={false}
            onClick={() => setGradientDirection('45deg')}>
            45 deg
          </MenuItem>
          <MenuItem
            key={'135deg'}
            selected={false}
            onClick={() => setGradientDirection('135deg')}>
            -45 deg
          </MenuItem>
          <MenuItem
            key={'ellipse at center'}
            selected={false}
            onClick={() => setGradientDirection('ellipse at center')}>
            Radial
          </MenuItem>
        </Menu>
      </Box>
      <Box className={classes.relativeContainer}>
        <GradientSlider
          track={false}
          ThumbComponent={(props: any) => {
            const index = props['data-index'];
            const point = gradient.points[index];

            return (
              <div
                {...props}
                onMouseDown={() => {
                  setEditingPoint(index as number);
                }}
                onMouseUp={() => {
                  setEditingPoint(index as number);
                }}
                className={classes.point}
                style={{
                  ...props.style,
                  backgroundColor: rgbaFromGradientPoint(point),
                  border:
                    index === editingPoint ? 'inset 1px #666' : 'transparent',
                }}
              />
            );
          }}
          step={5}
          onChangeCommitted={handleSliderChange}
          onChange={handleSliderChange}
          defaultValue={_.map(DEFAULT_GRADIENT.points, 'position') || []}
          value={_.map(gradient.points, 'position') || []}
        />
      </Box>

      <Box className={classes.relativeContainer}>
        {gradient.points.map((p, index) => {
          return (
            <div key={index}>
              {editingPoint === index && gradient.points.length >= 3 && (
                <Tooltip title="Delete color stop">
                  <IconButton
                    size="small"
                    style={{
                      top: 0,
                      left: `calc(${p.position}% - 9px)`,
                    }}
                    className={classes.thumbIcon}
                    onClick={() => deletePoint(index)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          );
        })}
      </Box>

      <Box className={classes.relativeContainer} mt={5} mb={1} mx="auto">
        {(editingPoint as number) >= 0 && (
          <SketchPicker
            className={classes.sketchPicker}
            color={rgbaFromGradientPoint(
              gradient.points[editingPoint as number],
            )}
            onChange={(newColor) => setColor(newColor, editingPoint)}
          />
        )}
      </Box>
      <Box className={classes.relativeContainer} mt={5} mb={1} mx="auto">
        <Paper className={classes.paper}>
          {!editingCss && (
            <div>
              {gradientToCss(gradient)}
              <IconButton
                className={classes.editCssIcon}
                size="small"
                onClick={() => setEditingCss(true)}>
                <Edit />
              </IconButton>
            </div>
          )}

          {editingCss && (
            <div>
              <TextField
                className={classes.textField}
                label="css: background-color"
                multiline={true}
                rows={4}
                defaultValue={gradientToCss(gradient)}
                onBlur={(event) => {
                  setGradient(cssToGradient(event.target.value));
                  setEditingCss(false);
                }}
                variant="outlined"
              />
            </div>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default GradientPicker;
