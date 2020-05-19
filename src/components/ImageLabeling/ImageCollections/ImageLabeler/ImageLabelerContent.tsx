import { createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import Select from 'react-select';
import { ICategory, ICategorySet, IImage, ILabelQueueImage } from '../../../../models';
import ContentLoading from '../../../ContentLoading';
import ImageCategoricalLabel from '../../models/labels/ImageLabel';
import MultiPolygon from '../../models/labels/MultiPolygon';
import MultiRectangle from '../../models/labels/MultiRectangle';
import ImageLabelListItem from './ImageLabelListItem';
import { GET_IMAGE_DATA, SAVE_LABELS } from './queries';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
    },
    content: {
      height: '100%',
      maxHeight: '100%',
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
      maxHeight: '90vh',
      overflow: 'auto',
      width: 0,
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '100%',
      flex: '10 0 auto',
    },
    canvasContainer: {
      backgroundImage: 'linear-gradient(to right, #757575 50%, #a4a4a4 50%), linear-gradient(to bottom, #757575 50%, #a4a4a4 50%)',
      backgroundBlendMode: 'difference, normal',
      backgroundSize: '2em 2em',
      overflow: 'auto',
    },
    bottomToolbar: {
      // lexShrink: 0
    },
    canvasHeader: {
      marginTop: theme.spacing(1),
    },
    toolbar: {
      marginTop: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    infobar: {
      background: theme.palette.primary.main,
      color: 'white',
      marginTop: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    infobarItem: {
      marginRight: theme.spacing(1) * 2,
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
      flexDirection: 'column',
    },
    labelList: {
      flexGrow: 1,
      overflow: 'auto',
    },
    right: {
      flex: 1,
      flexGrow: 2,
    },
    bottomSpacer: {
      height: 8,
      background: theme.palette.primary.dark,
    },
    canvas: {
      margin: 0,
      padding: 0,
    },
    appBar: {
      top: 'auto',
      bottom: 0,
      boxShadow: 'none',
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
      // background: `${theme.palette.secondary.main} !important`,
      border: `1px solid ${theme.palette.secondary.main}`,
    },
    listItemModified: {
      borderLeft: `2px solid red !important`,
      // background: `#d50000 !important`
    },
    margin: {
      margin: theme.spacing(1),
    },
    marginRight: {
      marginRight: theme.spacing(1),
    },
    checkbox: {
      padding: 0,
    },
    iconButton: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    grow: {
      flexGrow: 1,
    },
  });

interface IImageLabelerContentProps extends WithStyles<typeof styles>, WithApolloClient<object> {
  projectId: string;
  labels: ImageCategoricalLabel[];
  categorySets: ICategorySet[];
  image: IImage;
  labelQueueImage: ILabelQueueImage;
}

interface IImageLabelerContentState {
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
  labelsLoading: boolean;
  mousePos: IMousePos | undefined;
  viewMask: boolean;
  selectedLabelIndex: number;
}

interface IMousePos {
  x: number;
  y: number;
}

class ImageLabelerContent extends React.Component<IImageLabelerContentProps, IImageLabelerContentState> {
  constructor(props: IImageLabelerContentProps) {
    super(props);

    this.state = {
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
      labelsLoading: false,
      mousePos: undefined,
      viewMask: false,
      selectedLabelIndex: 0,
    };
  }

  componentDidUpdate() {
    this.draw();
  }

  handleChangeViewMask = () => {
    this.setState((state) => ({
      viewMask: !state.viewMask,
    }));
  }

  getSelectedLabel = () => {
    if (!this.state.labels) {
      return null;
    }
    return this.state.labels[this.state.selectedLabelIndex];
  }

  handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      ...this.state,
      [name]: e.target.value,
    });
  }

  handleSelectCategory = (categorySet: ICategorySet | null) => (e: any) => {
    if (!categorySet) { return; }

    const category = categorySet.categories.find(x => x.name === e.value);
    if (!category) { return; }

    this.setState({
      selectedCategory: category,
    });
  }

  handleSelectCategorySet = (e: any) => {
    const categorySet = this.props.categorySets.find(x => x.id === e.value);
    this.setState({
      categorySet: categorySet ? categorySet : null,
    });
  }

  getMousePos = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): IMousePos | undefined => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / this.state.zoom,
      y: (e.clientY - rect.top) / this.state.zoom,
    };
  }

  drawLabels = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) { return; }

    const ctx = canvas.getContext('2d');

    for (const label of this.state.labels) {
      if (label.visible) {
        label.draw(ctx, this.state.zoom);
      }
    }
  }

  closePolygonDisabled = () => {
    const label = this.getSelectedLabel();

    if (label == null || label.shape == null || !(label.shape instanceof MultiPolygon)) {
      return true;
    }
    const multipoly = label.shape;
    return !(multipoly.currentPolygon && multipoly.currentPolygon.points.length > 2);
  }

  onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const label = this.getSelectedLabel();
    if (!label) {
      return;
    }

    if (label.shape instanceof MultiPolygon) {
      const multiPoly = label.shape;
      const point = this.getMousePos(e);

      this.setState(s => ({
        ...s,
        mousePos: point,
      }));

      if (!point) { return; }

      multiPoly.addPoint([point.x, point.y]);

      let closePolygonDisabled = true;
      if (multiPoly.currentPolygon && multiPoly.currentPolygon.points.length > 2) {
        closePolygonDisabled = false;
      }

      label.modified = true;

      this.setState(s => ({
        ...s,
        canvasHeader: 'canvas clicked',
        closePolygonDisabled,
      }));
    }
  }

  handleImageLoad = () => {
    this.setState({
      imgLoaded: true,
    });
    this.drawImage();
    this.initDraw();
  }

  getMultiRect = (): MultiRectangle | null => {
    const label = this.getSelectedLabel();
    if (!label) { return null; }
    const shape = label.shape;
    if (!(shape instanceof MultiRectangle)) { return null; }
    return shape;
  }

  drawImage = () => {
    if (!this.state.imgLoaded) { return; }

    const zoom = this.state.zoom;
    const img = document.getElementById('image') as HTMLImageElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) { return; }

    const ctx = canvas.getContext('2d');
    const w = img.width * zoom;
    const h = img.height * zoom;
    canvas.width = w;
    canvas.height = h;
    ctx?.drawImage(img, 0, 0, w, h);
  }

  initDraw = () => {
    console.log('initDraw');
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) { return; }

    const canvasGrid = document.getElementById('canvas-grid');
    if (!canvasGrid) {
      return;
    }

    // Variables

    let lastMousePos: IMousePos = { x: 0, y: 0 };
    let mousePos: IMousePos = { x: 0, y: 0 };
    let mousedown = false;

    const getMousePos = (e: MouseEvent): IMousePos => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / this.state.zoom,
        y: (e.clientY - rect.top) / this.state.zoom,
      };
    };

    // Mousedown
    canvas.onmousedown = (e: MouseEvent) => {
      lastMousePos = getMousePos(e);
      mousedown = true;
    };

    // Mouseup
    canvas.onmouseup = e => {
      mousedown = false;
      const multiRect = this.getMultiRect();
      if (multiRect && multiRect.currentRectangle) {
        multiRect.endRectangle();
      }
      this.forceUpdate();
    };

    // Mousemove
    canvas.onmousemove = e => {
      const label = this.getSelectedLabel();

      if (!label) {
        return;
      }

      const shape = label.shape;
      if (!(shape instanceof MultiRectangle)) {
        return;
      }

      // const canvasx = canvas.offsetLeft - canvasGrid.scrollLeft;
      // const canvasy = canvas.offsetTop - canvasGrid.scrollTop;
      // mousex = e.clientX - canvasx;
      // mousey = e.clientY - canvasy;

      mousePos = getMousePos(e);

      if (mousedown) {
        const width = mousePos.x - lastMousePos.x;
        const height = mousePos.y - lastMousePos.y;

        const rect = [lastMousePos.x, lastMousePos.y, width, height];
        const [x, y, w, h] = rect;
        if (!shape.isRectangleStarted()) {
          shape.startRectangle(x, y, w, h);
        } else {
          shape.updateCurrentRectangle(x, y, w, h);
        }
        this.forceUpdate();
      }
    };
  }

  draw = () => {
    console.log('drawing...');

    if (!this.state.imgLoaded) {
      return;
    }

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) { return; }

    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    this.drawImage();
    this.drawLabels();
  }

  zoomIn = () => {
    this.setState({
      zoom: Math.min(8.0, this.state.zoom + 0.2),
    });
  }

  zoomOut = () => {
    this.setState({
      zoom: Math.max(0.2, this.state.zoom - 0.2),
    });
  }

  closePolygon = () => {
    const label = this.getSelectedLabel();
    if (!label) { return; }
    const poly = label.shape as MultiPolygon;
    poly.endPolygon();
    this.forceUpdate();
  }

  deleteLabel = (label: ImageCategoricalLabel, labelIndex: number) => async () => {
    let labels = this.state.labels;
    labels = [...labels.slice(0, labelIndex), ...labels.slice(labelIndex + 1)];
    this.setState({ ...this.state, labels });
  }

  saveLabels = async () => {
    this.setState({
      labelsLoading: true,
    });

    const labels = this.state.labels;

    const variables = {
      imageId: this.props.image.id,
      labels: labels.map((label) => {
        const labelInput: any = {
          shape: label.shapeName,
          categorySetId: label.categorySetId,
          category: label.category,
          value: label.toJson(),
        };

        if (label.id) {
          labelInput.id = label.id;
        }
        return labelInput;
      }),
    };

    await this.props.client.mutate({
      mutation: SAVE_LABELS,
      variables,
      refetchQueries: [{
        query: GET_IMAGE_DATA,
        variables: {
          imageId: this.props.image.id,
          projectId: this.props.projectId,
        },
      }],
      awaitRefetchQueries: true,
    });

    this.setState({
      labelsLoading: false,
    });
  }

  reloadLabels = async () => {
    // todo;
  }

  nextQueueItem = async () => {
    // todo
  }

  handleShapeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('changing shape');
    this.setState({
      shape: e.target.value,
    });
  }

  addLabel = () => {
    console.log('adding label');
    const { categorySet, selectedCategory } = this.state;

    let label;
    if (categorySet) {
      label = new ImageCategoricalLabel(null, this.state.shape, categorySet, selectedCategory?.name || null);
    } else {
      label = new ImageCategoricalLabel(null, this.state.shape, null, null);
    }
    label.modified = true;

    const labels = this.state.labels;
    labels.push(label);
    this.setState({
      labels,
    });
  }

  onCreated = () => {
    // todo
  }

  markComplete = async () => {
    // todo;
  }

  markInProgress = async () => {
    // todo
  }

  markCompleteDisabled = () => {
    return this.state.labels.length === 0 || this.state.labels.some(x => x.modified);
  }

  saveDisabled = () => {
    return this.state.labels.every(x => !x.modified);
  }

  viewMaskDisabled = () => {
    return !this.props.image.maskUrl;
  }

  render() {
    const { classes, image, labelQueueImage } = this.props;
    const selectedLabel = this.getSelectedLabel();

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
      <Button size="small" onClick={this.markComplete} disabled={this.markCompleteDisabled()}>{'Complete'}</Button>
    );
    if (labelQueueImage.status === 'complete') {
      approveButton = (
        <Button size="small" onClick={this.markInProgress}>{'In Progress'}</Button>
      );
    }

    const categorySetOptions = this.props.categorySets.map(x => ({
      value: x.id,
      label: x.name,
    }));

    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.labelTools}>
            <Paper className={classes.paper}>
              <form>
                <FormGroup row={true}>
                  <FormControl>
                    <FormLabel component="legend">Shape</FormLabel>
                    <RadioGroup
                      aria-label="label-shape"
                      name="label-shape"
                      value={this.state.shape}
                      onChange={this.handleShapeChange}
                      row={true}
                    >
                      <FormControlLabel value="box" control={<Radio />} label="Bounding Box" />
                      <FormControlLabel value="polygon" control={<Radio />} label="Polygon" />
                      <FormControlLabel value="none" control={<Radio />} label="None" />
                    </RadioGroup>
                  </FormControl>
                </FormGroup>
                <FormGroup row={true}>
                  <FormControl>
                    <FormLabel component="legend">Type</FormLabel>
                    <RadioGroup
                      aria-label="label-type"
                      name="label-type"
                      value={this.state.type}
                      onChange={this.handleChange('type')}
                      row={true}
                    >
                      <FormControlLabel value="categorical" control={<Radio />} label="Categorical" />
                      <FormControlLabel value="none" control={<Radio />} label="None" disabled={true} />
                    </RadioGroup>
                  </FormControl>
                </FormGroup>
                <FormGroup row={true}>
                  <FormControl className={classes.formControl}>
                    <Select placeholder="Category Set" options={categorySetOptions} onChange={this.handleSelectCategorySet} />
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <Select placeholder="Category" options={this.state.categorySet?.categories.map(x => ({
                      value: x.name,
                      label: x.name,
                    }))} onChange={this.handleSelectCategory(this.state.categorySet)} />
                  </FormControl>
                </FormGroup>
                <FormGroup row={true}>
                  <FormControl className={classes.formControl} />
                </FormGroup>
              </form>
              <br />
              {/* <ImageLabelCreate categorySets={props.categorySets} onNewLabel={onNewLabel} /> */}
              <Button variant="contained" color="secondary" size="small" onClick={this.addLabel}>Add Label</Button>
              <br />
            </Paper>
            <Paper className={classes.labelListContainer}>
              {this.state.labelsLoading ? (
                <ContentLoading />
              ) : (
                  <React.Fragment>
                    <Toolbar disableGutters={true} variant="dense">
                      <Typography variant="h6">
                        {'Labels'}
                      </Typography>
                      <Typography className={classes.grow} />
                      <Button variant="contained" size="small" onClick={this.saveLabels}
                        disabled={this.saveDisabled()}
                        color="secondary">
                        {'Save'}
                        {/* <SaveIcon className={classes.rightIcon} variant="contained"></SaveIcon> */}
                      </Button>
                    </Toolbar>
                    <div className={classes.labelList}>
                      <List component="nav">
                        {this.state.labels.map((label, i) => {
                          return (
                            <ImageLabelListItem key={i} label={label} labelIndex={i} isSelected={this.state.selectedLabelIndex === i}
                              onDelete={this.deleteLabel(label, i)}
                              onSelect={(i: number) => this.setState({ selectedLabelIndex: i })}
                              onChange={() => this.forceUpdate()}
                            />
                          );
                        })}
                      </List>
                    </div>
                  </React.Fragment>
                )}
            </Paper>
          </div>
          <div className={classes.middle}>
            <Paper className={classes.toolbar}>
              <Toolbar variant="dense" disableGutters={true}>
                <Button size="small" variant="contained" className={classes.marginRight} onClick={this.zoomIn} color="secondary">
                  <ZoomInIcon />
                </Button>
                <Button size="small" variant="contained" className={classes.marginRight} onClick={this.zoomOut} color="secondary">
                  <ZoomOutIcon />
                </Button>
                <Button disabled={this.closePolygonDisabled()} onClick={this.closePolygon}>{'Close Polygon'}</Button>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.viewMask}
                      onChange={this.handleChangeViewMask}
                      color="secondary"
                      disabled={this.viewMaskDisabled()}
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
                  {'Mode: labeling'}
                </Typography>
                <Typography color="inherit" className={classes.infobarItem}>
                  {`Zoom Level: ${this.state.zoom.toFixed(1)}`}
                </Typography>
                {this.state.mousePos ? (
                  <Typography color="inherit" className={classes.infobarItem}>
                    {`Mouse Pos: (${this.state.mousePos.x}, ${this.state.mousePos.y})`}
                  </Typography>
                ) : null}
                {selectedLabelInfo}
              </Toolbar>
            </Paper>
            <div className={classes.canvasHeader} />
            <div className={classes.canvasContainer} id="canvas-grid">
              <canvas id="canvas" className={classes.canvas} onClick={this.onCanvasClick}>
                <img id="image" src={image.url} onLoad={this.handleImageLoad} alt="to-label" />
              </canvas>
            </div>
            <Paper className={classes.bottomToolbar} >
              <Toolbar variant="dense">
                <Typography>{'Bottom toolbar'}</Typography>
              </Toolbar>
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withApollo<IImageLabelerContentProps>(ImageLabelerContent));
