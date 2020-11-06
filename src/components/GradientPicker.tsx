import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,

  Slider,

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
  ArrowBack,
  ArrowDownward,
  ArrowForward,
  ArrowUpward,
  Delete,

} from '@material-ui/icons';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ColorResult, SketchPicker } from 'react-color';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',

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
      flexWrap: 'wrap',
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
      height: 25,
      width: 25,
      position: 'absolute',
      bottom: 5,
      left: 'calc(50% - 20px)',
      backgroundColor: 'rgba(255,255,255,.9)',
      color: theme.palette.grey[500],
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,1)',
      },
    },
    gradientTypeButton: {
      height: 25,
      position: 'absolute',
      left: 5,
      top: 5,
      fontSize: 14,
      backgroundColor: 'rgba(255,255,255,.9)',
      color: theme.palette.grey[500],
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,1)',
      },
    },
    presetBox: {
      width: 40,
      height: 40,
      borderRadius: theme.spacing(1),
      margin: 2,
      cursor: 'pointer',
    },
    sketchPicker: {},
    colorPicker: {
      width: '100%',
    },
    colorArray: {
      marginLeft: '50px',
      width: '60%',
    },
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

type GradientDirection = keyof typeof directionIconMap;

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

const hexToRgbA = (hex: string) => {
  let c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return (
      /* tslint:disable-next-line */
      'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)'
    );
  }
  return 'rgba(0,0,0,1)';
};

const directionIconMap = {
  'to top': <ArrowUpward />,
  'to bottom': <ArrowDownward />,
  'to right': <ArrowForward />,
  'to left': <ArrowBack />,
  '0deg': <span>0&deg;</span>,
  '45deg': <span>45&deg;</span>,
  '90deg': <span>90&deg;</span>,
  '135deg': <span>135&deg;</span>,
  '180deg': <span>180&deg;</span>,
  '225deg': <span>225&deg;</span>,
  '270deg': <span>270&deg;</span>,
  '315deg': <span>315&deg;</span>,
  'ellipse at center': <AllOut />,
  ellipse: <span>Ellipse</span>,
  'circle at center': <AllOut />,
  circle: <span>Circle</span>,
};

const GradientSlider = withStyles({
  rail: {
    opacity: 0,
  },
  track: {
    opacity: 0,
  },
})(Slider);

export interface IGradientPickerProps {
  defaultValue?: string;
  label?: string;
  onChange?: (result: string) => void;
}

const presetBgs = [
  'linear-gradient(135deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
  'linear-gradient(90deg, #00DBDE 0%, #FC00FF 100%)',
  'linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)',
  'linear-gradient(0deg, #08AEEA 0%, #2AF598 100%)',
  'linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
  'linear-gradient(to bottom, #0ba360 0%, #3cba92 100%)',
  'linear-gradient(to top, #0ba360 0%, #3cba92 100%)',
  'linear-gradient(to top, #3f51b1 0%, #5a55ae 13%, #7b5fac 25%, #8f6aae 38%, #a86aa4 50%, #cc6b8e 62%, #f18271 75%, #f3a469 87%, #f7c978 100%)',
  'linear-gradient(to top, #e14fad 0%, #f9d423 100%)',
  'linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)',
  'linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)',
  'linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)',
  'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)',
  'linear-gradient(to bottom, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)',
];

const GradientPicker = ({
  defaultValue,
  label,
  onChange,
}: IGradientPickerProps) => {
  const classes = useStyles();

  const gradientToCss = (gradient: IGradientSpec) => {
    let browserParam = 'linear-gradient';
    if (
      gradient.direction.indexOf('circle') >= 0 ||
      gradient.direction.indexOf('ellipse') >= 0
    ) {
      browserParam = 'radial-gradient';
    }

    const pointsStr = gradient.points.map((p) => {
      return `${rgbaFromGradientPoint(p)} ${p.position}%`;
    });

    const css = `${browserParam}(${gradient.direction}, ${pointsStr.join(
      ', ',
    )})`;

    return css;
  };

  const cssToGradient = (css: string) => {
    let direction = css.split('(')[1]?.split(',')[0] as GradientDirection;

    if (
      !!!(
        Object.keys(directionIconMap).indexOf(direction) >= 0 ||
        /\b(\d+\.?\d*)\s*(deg)/.test(direction)
      )
    ) {
      direction = '0deg';
    }

    const colors = css
      .substring(css.indexOf(',') + 1, css.length - 1)
      .split(/%,|% | % ,/);

    const points = colors.map((c: string) => {
      c = c.trim();
      c = c.replace('%', '');

      let positionStr = '0';

      let rgba = c.split(')')[0];
      if (c.indexOf('rgba') >= 0) {
        positionStr = c.split(')')[1];
      }

      const indexofPound = c.indexOf('#');
      if (indexofPound >= 0) {
        const hex = c.substring(indexofPound, indexofPound + 7);
        rgba = hexToRgbA(hex);
        positionStr = c.split(' ')[1];
      }

      rgba = rgba.replace('rgba(', '');
      positionStr = positionStr.trim();

      const position = parseInt(positionStr);
      const split = rgba.split(/[,)]+/);

      const point: IGradientPoint = {
        position,
        color: {
          r: parseInt(split[0]),
          g: parseInt(split[1]),
          b: parseInt(split[2]),
          a: parseFloat(split[3]),
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

  const rgbaFromGradientPoint = (point: IGradientPoint) => {
    let alpha = 1;
    if (point.color.a !== undefined) {
      alpha = point.color.a;
    }

    const rgbastr = `rgba(${point.color.r},${point.color.g},${point.color.b},${alpha})`;

    return rgbastr;
  };

  const [gradient, setGradient] = useState(
    defaultValue ? cssToGradient(defaultValue) : DEFAULT_GRADIENT,
  );
  const [editingPoint, setEditingPoint] = useState<number | undefined>();
  const [gradientTypesMenu, showGradientTypesMenu] = useState(false);
  const [gradientTypesAnchor, setAnchor] = useState<null | HTMLElement>(null);

  // const [editingCss, setEditingCss] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setGradient(cssToGradient(defaultValue));
    }
  }, [defaultValue]);

  const updateGradient = (newGradient: IGradientSpec) => {
    setGradient(newGradient);
    onChange?.(gradientToCss(newGradient));
  };

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

    const grad = {
      direction: gradient.direction,
      points: newPoints,
    };
    updateGradient(grad);
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

    updateGradient(newGradient);
    setEditingPoint(newPointIndex);
  };

  const deletePoint = (position: number) => {
    const points = _.filter(gradient.points, (p, index) => {
      return index !== position;
    });

    const grad = {
      direction: gradient.direction,
      points,
    };
    updateGradient(grad);
    onChange?.(gradientToCss(grad));
  };

  const setGradientDirection = (value: GradientDirection) => {
    const newGradient = gradient;
    newGradient.direction = value;
    updateGradient(newGradient);
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

    updateGradient(newGradient);
    setColor(undefined, editingPoint);
  };

  return (
    <div className={classes.root}>
      <Typography variant="subtitle1">{label}</Typography>
      <div className={classes.colorPicker}>
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
            <Button
              className={classes.gradientTypeButton}
              size={'small'}
              onClick={(e) => {
                showGradientTypesMenu(true);
                setAnchor(e.currentTarget);
              }}>
              {directionIconMap[gradient.direction] || gradient.direction}
            </Button>
          </Tooltip>
          <Menu
            anchorEl={gradientTypesAnchor}
            keepMounted={true}
            open={gradientTypesMenu}
            onClose={() => showGradientTypesMenu(false)}>
            {Object.keys(directionIconMap).map((direction, index) => {
              return (
                <MenuItem
                  key={`direction_${index}`}
                  selected={false}
                  onClick={() =>
                    setGradientDirection(direction as GradientDirection)
                  }>
                  {direction}
                </MenuItem>
              );
            })}
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
            <div>
              <SketchPicker
                className={classes.sketchPicker}
                color={rgbaFromGradientPoint(
                  gradient.points[editingPoint as number],
                )}
                onChange={(newColor) => setColor(newColor, editingPoint)}
              />
            </div>
          )}
        </Box>
      </div>
      <div className={classes.colorArray}>
        <Box className={classes.relativeContainer} mt={5} mb={1} mx="auto">
          {presetBgs.map((p, index) => {
            return (
              <Tooltip title={`Preset : ${p}`} key={`preset_${index}`}>
                <Box
                  className={classes.presetBox}
                  style={{ background: p }}
                  onClick={() => {
                    updateGradient(cssToGradient(p));
                    // setEditingCss(false);
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>
      </div>
    </div>
  );
};

export default GradientPicker;
