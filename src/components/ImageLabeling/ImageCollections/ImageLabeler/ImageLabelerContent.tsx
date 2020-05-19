import React, { useState, useEffect, useReducer } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { Typography, makeStyles, createStyles, Theme } from '@material-ui/core';
import gql from "graphql-tag";
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Switch from '@material-ui/core/Switch';
import ImageCategoricalLabel from '../../models/labels/ImageLabel';
import { ICategory, ICategorySet, IImage, ILabelQueueImage } from '../../../../models';
import MultiPolygon from '../../models/labels/MultiPolygon';
import MultiRectangle from '../../models/labels/MultiRectangle';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ImageLabelListItem from './ImageLabelListItem';

const SAVE_LABELS = gql`
  mutation saveImageLabels(
    $imageId: Int!,
    $labels: [SaveImageLabelInput]!
    ) {
      imageLabelsSave(
        imageId: $imageId, 
        labels: $labels
        ) {
      id
      imageId
      shape
      categorySetId
      category
      value
      creator
    }
  }
`

const deleteLabel = gql`
  mutation deleteImageCategoricalLabel(
    $id: Int!,
  ) {
    deleteImageCategoricalLabel(
      id: $id, 
    ) {
      id
      status
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
    },
    content: {
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
    },
    labelTools: {
      padding: theme.spacing(1),
      flex: 1,
      flexGrow: 3,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      minWidth: 400,
    },
    middle: {
      width: 0,
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing(1),
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
      maxWidth: '100%',
      flex: '10 0 auto'
    },
    canvasContainer: {
      backgroundImage: "linear-gradient(to right, #757575 50%, #a4a4a4 50%), linear-gradient(to bottom, #757575 50%, #a4a4a4 50%)",
      backgroundBlendMode: "difference, normal",
      backgroundSize: "2em 2em",
      overflow: 'auto',
      flex: '1 0 auto',
    },
    bottomToolbar: {
      height: 0,
      bottom: 0,
      minHeight: 30,
      flex: '1 0 auto',
    },
    canvasHeader: {
      marginTop: theme.spacing(1)
    },
    toolbar: {
      marginTop: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
    infobar: {
      background: theme.palette.primary.main,
      color: 'white',
      marginTop: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    infobarItem: {
      marginRight: theme.spacing(1) * 2
    },
    paper: {
      padding: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    paperBottom: {
      padding: theme.spacing(1),
    },
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    nested: {
      paddingLeft: theme.spacing(1) * 8,
    },
    labelListContainer: {
      padding: theme.spacing(1),
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column'
    },
    labelList: {
      flexGrow: 1,
      overflow: 'auto'
    },
    right: {
      flex: 1,
      flexGrow: 2
    },
    bottomSpacer: {
      height: 8,
      background: theme.palette.primary.dark
    },
    canvas: {
      overflow: 'auto',
    },
    appBar: {
      top: 'auto',
      bottom: 0,
      boxShadow: 'none'
    },
    button: {
      display: 'block',
      marginTop: theme.spacing(1) * 2,
    },
    formControl: {
      // marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      minWidth: 150,
    },
    selected: {
      //background: `${theme.palette.secondary.main} !important`,
      border: `1px solid ${theme.palette.secondary.main}`,
    },
    listItemModified: {
      borderLeft: `2px solid red !important`,
      //background: `#d50000 !important`
    },
    margin: {
      margin: theme.spacing(1)
    },
    marginRight: {
      marginRight: theme.spacing(1)
    },
    checkbox: {
      padding: 0
    },
    iconButton: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    grow: {
      flexGrow: 1,
    },
  }));

interface IImageLabelerContentProps {
  labels: ImageCategoricalLabel[],
  categorySets: ICategorySet[],
  image: IImage,
  labelQueueImage: ILabelQueueImage,
}

function ImageLabelerContent(props: IImageLabelerContentProps) {
  const { image, categorySets, labelQueueImage } = props;
  const classes = useStyles();
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  interface IMousePos {
    x: number;
    y: number;
  }

  interface IState {
    closePolygonDisabled: boolean;
    categorySetOpen: boolean;
    canvasHeader: string;
    zoom: number;
    imgLoaded: boolean;
    labels: ImageCategoricalLabel[];

    // label settings state
    shape: string;
    type: string;
    selectedCategory: ICategory | null;
    categorySet: ICategorySet | null;
    loading: boolean;
    mousePos: IMousePos | undefined;
    viewMask: boolean;
    selectedLabelIndex: number;
  }

  const [state, setState] = useState<IState>({
    closePolygonDisabled: true,
    categorySetOpen: false,
    canvasHeader: 'test',
    zoom: 1.0,
    imgLoaded: false,
    labels: props.labels,
    // label settings state
    shape: 'box',
    type: 'categorical',
    selectedCategory: null,
    categorySet: null,
    loading: false,
    mousePos: undefined,
    viewMask: false,
    selectedLabelIndex: 0
  });

  useEffect(() => {
    draw();
  });

  const handleChangeViewMask = () => {
    setState({
      ...state,
      viewMask: !state.viewMask
    });
  }

  const getSelectedLabel = () => {
    if (!state.labels) {
      return null;
    }
    return state.labels[state.selectedLabelIndex];
  }

  const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: e.target.value,
    });
  };

  const handleSelectCategory = (categorySet: ICategorySet | null) => (e: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
  }>) => {
    if (!categorySet) return;

    const category = categorySet.categories.find(x => x.name === e.target.value);
    if (!category) return;

    setState({
      ...state,
      selectedCategory: category,
    });
  };

  const handleSelectCategorySet = (e: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
  }>) => {
    const categorySet = props.categorySets.find(x => x.id === e.target.value);
    setState({
      ...state,
      categorySet: categorySet ? categorySet : null,
    });
  }

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): IMousePos | undefined => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / state.zoom,
      y: (e.clientY - rect.top) / state.zoom
    }
  }

  const drawLabels = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    for (const label of state.labels) {

      if (label.visible) {
        label.draw(ctx, state.zoom);
      }
    }
  }

  const closePolygonDisabled = () => {
    const label = getSelectedLabel();

    if (label == null || label.shape == null || !(label.shape instanceof MultiPolygon)) {
      return true;
    }
    const multipoly = label.shape;
    return !(multipoly.currentPolygon && multipoly.currentPolygon.points.length > 2);
  }

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    // const label = getSelectedLabel();

    // if (!label) {
    //   return;
    // }

    // if (label.shape instanceof MultiPolygon) {
    //   const multiPoly = label.shape;
    //   const point = getMousePos(e);

    //   setState(s => ({
    //     ...s,
    //     mousePos: point
    //   }));

    //   if (!point) return;

    //   multiPoly.addPoint([point.x, point.y]);

    //   let closePolygonDisabled = true;
    //   if (multiPoly.currentPolygon && multiPoly.currentPolygon.points.length > 2) {
    //     closePolygonDisabled = false;
    //   }

    //   label.modified = true;

    //   setState(s => ({
    //     ...s,
    //     canvasHeader: 'canvas clicked',
    //     closePolygonDisabled,
    //   }));
    // }
  }

  const handleImageLoad = () => {
    setState({
      ...state,
      imgLoaded: true
    });
    drawImage();
    initDraw();
  }

  const getMultiRect = (): MultiRectangle | null => {
    const label = getSelectedLabel();
    if (!label) return null;
    const shape = label.shape;
    if (!(shape instanceof MultiRectangle)) return null;
    return shape;
  }

  const drawImage = () => {
    if (!state.imgLoaded) return;

    const zoom = state.zoom;
    const img = document.getElementById('image') as HTMLImageElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = img.width * zoom;
    const h = img.height * zoom;
    canvas.width = w;
    canvas.height = h;
    ctx?.drawImage(img, 0, 0, w, h);
  }

  const initDraw = () => {
    console.log('initDraw');
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    const canvasGrid = document.getElementById('canvas-grid');
    if (!canvasGrid)
      return;

    //Variables

    let lastMousex = 0;
    let lastMousey = 0;
    let mousex = 0;
    let mousey = 0;
    let mousedown = false;

    //Mousedown
    canvas.onmousedown = e => {
      const rect = canvas.getBoundingClientRect();
      lastMousex = (e.clientX - rect.left);
      lastMousey = (e.clientY - rect.top);
      mousedown = true;
    };

    //Mouseup
    canvas.onmouseup = e => {
      mousedown = false;
      const multiRect = getMultiRect();
      if (multiRect && multiRect.currentRectangle) {
        multiRect.endRectangle();
      }
      forceUpdate();
    };

    //Mousemove
    canvas.onmousemove = e => {
      const label = getSelectedLabel();

      if (!label) {
        return;
      }

      const shape = label.shape;
      if (!(shape instanceof MultiRectangle)) {
        return;
      }

      const canvasx = canvas.offsetLeft - canvasGrid.scrollLeft;
      const canvasy = canvas.offsetTop - canvasGrid.scrollTop;
      mousex = e.clientX - canvasx;
      mousey = e.clientY - canvasy;
      if (mousedown) {
        const width = mousex - lastMousex;
        const height = mousey - lastMousey;

        const rect = [lastMousex, lastMousey, width, height].map(x => x / state.zoom);

        const [x, y, w, h] = rect;
        if (!shape.isRectangleStarted()) {
          shape.startRectangle(x, y, w, h);
        } else {
          shape.updateCurrentRectangle(x, y, w, h);
        }
        forceUpdate();
      }
    };
  }

  const draw = () => {
    console.log('drawing...');

    if (!state.imgLoaded) {
      return;
    }

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    drawImage();
    drawLabels();
  }

  const zoomIn = () => {
    setState({
      ...state,
      zoom: Math.min(8.0, state.zoom + 0.2)
    });
  }

  const zoomOut = () => {
    setState({
      ...state,
      zoom: Math.max(0.2, state.zoom - 0.2)
    });
  }

  const closePolygon = () => {
    const label = getSelectedLabel();
    if (!label) return;
    const poly = label.shape as MultiPolygon;
    poly.endPolygon();
    forceUpdate();
  }


  const deleteLabel = (label: ImageCategoricalLabel, labelIndex: number) => async () => {
    let labels = state.labels;
    labels = [...labels.slice(0, labelIndex), ...labels.slice(labelIndex + 1)];
    setState({ ...state, labels });
  }

  const saveLabels = async () => {
    // todo;
  }

  const reloadLabels = async () => {
    // todo;
  }

  const nextQueueItem = async () => {
    // todo
  }

  const handleShapeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('changing shape');
    setState({
      ...state,
      shape: e.target.value
    });
  }

  const addLabel = () => {
    console.log('adding label');
    const { categorySet, selectedCategory } = state;
    
    let label;
    if (categorySet) {
      label = new ImageCategoricalLabel(null, state.shape, categorySet, selectedCategory?.name);
    } else {
      label = new ImageCategoricalLabel(null, state.shape, null, undefined);
    }
    label.modified = true;

    const labels = state.labels;
    labels.push(label);
    setState({
      ...state,
      labels
    })
  };

  const onCreated = () => {
    // todo
  }


  const markComplete = async () => {
    // todo;
  }

  const markInProgress = async () => {
    // todo
  }

  const markCompleteDisabled = () => {
    return state.labels.length === 0 || state.labels.some(x => x.modified);
  }

  const saveDisabled = () => {
    return state.labels.every(x => !x.modified);
  }

  const viewMaskDisabled = () => {
    return !image.maskUrl;
  }

  const selectedLabel = getSelectedLabel();

  let selectedLabelInfo;
  if (selectedLabel) {
    selectedLabelInfo = (
      <React.Fragment>
        <Typography color="inherit" className={classes.infobarItem}>
          {selectedLabel.id ? `Label Id=${selectedLabel.id}` : 'New Label'}
        </Typography>
        <Typography color="inherit" className={classes.infobarItem}>
          {`Label Shape=${selectedLabel.shapeName}`}
        </Typography>
      </React.Fragment>
    );
  }


  let approveButton = (
    <Button size="small" onClick={markComplete} disabled={markCompleteDisabled()}>{"Complete"}</Button>
  );
  if (labelQueueImage.status === "complete") {
    approveButton = (
      <Button size="small" onClick={markInProgress}>{"In Progress"}</Button>
    );
  }

  const categorySetOptions = props.categorySets.map(x => ({
    value: x.id,
    label: x.name,
  }));

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.labelTools}>
          <Paper className={classes.paper}>
            <form>
              <FormGroup row>
                <FormControl>
                  <FormLabel component="legend">Shape</FormLabel>
                  <RadioGroup
                    aria-label="label-shape"
                    name="label-shape"
                    value={state.shape}
                    onChange={handleShapeChange}
                    row
                  >
                    <FormControlLabel value="box" control={<Radio />} label="Bounding Box" />
                    <FormControlLabel value="polygon" control={<Radio />} label="Polygon" />
                    <FormControlLabel value="none" control={<Radio />} label="None" />
                  </RadioGroup>
                </FormControl>
              </FormGroup>
              <FormGroup row>
                <FormControl>
                  <FormLabel component="legend">Type</FormLabel>
                  <RadioGroup
                    aria-label="label-type"
                    name="label-type"
                    value={state.type}
                    onChange={handleChange("type")}
                    row
                  >
                    <FormControlLabel value="categorical" control={<Radio />} label="Categorical" />
                    <FormControlLabel value="none" control={<Radio />} label="None" disabled />
                  </RadioGroup>
                </FormControl>
              </FormGroup>
              <FormGroup row>
                {/* <FormControl className={classes.formControl}>
                  <Select placeholder="Category Set" options={categorySetOptions} onChange={handleSelectCategorySet} />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <Select placeholder="Category" options={state.categorySet?.categories.map(x => ({
                    value: x.name,
                    label: x.name,
                  }))} onChange={handleSelectCategory(state.categorySet)} />
                </FormControl> */}
              </FormGroup>
              <FormGroup row>
                <FormControl className={classes.formControl}>

                </FormControl>
              </FormGroup>
            </form>
            <br />
            {/* <ImageLabelCreate categorySets={props.categorySets} onNewLabel={onNewLabel} /> */}
            <Button variant="contained" color="secondary" size="small" onClick={addLabel}>Add Label</Button>
            <br />
          </Paper>
          <Paper className={classes.labelListContainer}>
            <React.Fragment>
              <Toolbar disableGutters={true} variant="dense">
                <Typography variant="h6">
                  {"Labels"}
                </Typography>
                <Typography className={classes.grow}>

                </Typography>
                <Button variant="contained" size="small" onClick={saveLabels}
                  disabled={saveDisabled()}
                  color="secondary">
                  {"Save"}
                  {/* <SaveIcon className={classes.rightIcon} variant="contained"></SaveIcon> */}
                </Button>
              </Toolbar>
              <div className={classes.labelList}>
                <List component="nav">
                  {state.labels.map((label, i) => {
                    return (
                      <ImageLabelListItem label={label} labelIndex={i} isSelected={state.selectedLabelIndex===i}
                        onDelete={deleteLabel(label, i)}
                        onSelect={(i: number) => setState({...state, selectedLabelIndex: i})}
                        onChange={() => forceUpdate()}
                      />
                    );
                  })}
                </List>
              </div>
            </React.Fragment>
          </Paper>
        </div>
        <div className={classes.middle}>
          <Paper className={classes.toolbar}>
            <Toolbar variant="dense" disableGutters={true}>
            <Button size="small" variant="contained" className={classes.marginRight} onClick={zoomIn} color="secondary">
              <ZoomInIcon />
            </Button>
            <Button size="small" variant="contained" className={classes.marginRight} onClick={zoomOut} color="secondary">
              <ZoomOutIcon />
            </Button>
              <Button disabled={closePolygonDisabled()} onClick={closePolygon}>{"Close Polygon"}</Button>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.viewMask}
                    onChange={handleChangeViewMask}
                    color="secondary"
                    disabled={viewMaskDisabled()}
                  />
                }
                label="View Mask"
              />
              <div className={classes.grow} />
              {approveButton}
            </Toolbar>
          </Paper>
          <Paper className={classes.infobar}>
            <Toolbar variant="dense" disableGutters={true}>
              <Typography color="inherit" className={classes.infobarItem}>
                {"Mode: labeling"}
              </Typography>
              <Typography color="inherit" className={classes.infobarItem}>
                {`Zoom Level: ${state.zoom.toFixed(1)}`}
              </Typography>
              {state.mousePos ? (
                <Typography color="inherit" className={classes.infobarItem}>
                  {`Mouse Pos: (${state.mousePos.x}, ${state.mousePos.y})`}
                </Typography>
              ) : null}
              {selectedLabelInfo}
            </Toolbar>
          </Paper>
          <div className={classes.canvasHeader}>
          </div>
          <div className={classes.canvasContainer} id="canvas-grid">
            <canvas id="canvas" className={classes.canvas} onClick={onCanvasClick}>
              <img id="image" src={image.url} onLoad={handleImageLoad} alt="image" />
            </canvas>
          </div>
          <Paper className={classes.bottomToolbar}>
            <Toolbar variant="dense">
            </Toolbar>
          </Paper>
        </div>
      </div>
    </div>
  );
}


const NEXT_LABEL_QUEUE_IMAGE = gql`
  mutation labelQueueItemNext($collectionId: String!) {
    labelQueueItemNext(collectionId: $collectionId) {
      imageId
      status
      labeler
    }
  }
`;

const COMPLETE_LABEL_QUEUE_IMAGE = gql`
  mutation labelQueueItemComplete($imageId: Int!) {
    labelQueueItemComplete(imageId: $imageId) {
      imageId
      status
      labeler
    }
  }
`;

const SET_IN_PROGRESS = gql`
  mutation labelQueueItemInProgress($imageId: Int!) {
    labelQueueItemInProgress(imageId: $imageId) {
      imageId
      status
      labeler
    }
  }
`;

export default ImageLabelerContent;
