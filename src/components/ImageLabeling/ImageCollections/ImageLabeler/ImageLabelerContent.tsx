import { useApolloClient } from '@apollo/react-hooks';
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
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
import SaveIcon from '@material-ui/icons/Save';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import Select from 'react-select';
import { ICategory, ICategorySet, IImage, ILabelQueueImage } from '../../../../models';
import * as actions from '../../../../store/image-labeling/actions';
import { getLabels, getSelectedLabel, getSelectedLabelIndex, deletedSavedLabels } from '../../../../store/image-labeling/selectors';
import ContentLoading from '../../../ContentLoading';
import ImageCategoricalLabel from '../../models/labels/ImageLabel';
import MultiPolygon from '../../models/labels/MultiPolygon';
import MultiRectangle from '../../models/labels/MultiRectangle';
import Rectangle from '../../models/labels/Rectangle';
import ImageLabelerCanvas from './ImageLabelerCanvas';
import ImageLabelList from './ImageLabelList';
import ImageLabelListItem from './ImageLabelListItem';
import { COMPLETE_LABEL_QUEUE_IMAGE, GET_IMAGE_DATA, NEXT_LABEL_QUEUE_IMAGE, SAVE_LABELS } from './queries';

const useStyles = makeStyles((theme: Theme) =>
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
  }));

const mapDispatch = {
  addLabel: actions.addLabel,
  removeLabel: actions.removeLabel,
  updateLabel: actions.updateLabel,
  selectLabel: actions.selectLabel,
};

const connector = connect(null, mapDispatch);

interface IImageLabelerContentProps extends ConnectedProps<typeof connector> {
  projectId: string;
  categorySets: ICategorySet[];
  image: IImage;
  labelQueueImage: ILabelQueueImage;
}

interface IMousePos {
  x: number;
  y: number;
}

interface IImageLabelerContentState {
  closePolygonDisabled: boolean;
  categorySetOpen: boolean;
  canvasHeader: string;
  zoom: number;
  imgLoaded: boolean;

  // label settings state
  shape: string;
  type: string;
  selectedCategory: ICategory | null;
  categorySet: ICategorySet | null;
  labelsLoading: boolean;
  mousePos: IMousePos | undefined;
  viewMask: boolean;
}

const ImageLabelerContent: React.FC<IImageLabelerContentProps> = (props) => {
  const classes = useStyles();
  const labels = useSelector(getLabels);
  const selectedLabel = useSelector(getSelectedLabel);
  const selectedLabelIndex = useSelector(getSelectedLabelIndex);
  const hasDeletedLabels = useSelector(deletedSavedLabels);

  const client = useApolloClient();

  const { image, labelQueueImage, categorySets } = props;

  const [state, setState] = useState<IImageLabelerContentState>({
    closePolygonDisabled: true,
    categorySetOpen: false,
    canvasHeader: 'test',
    zoom: 1.0,
    imgLoaded: false,

    // label settings state
    shape: 'box',
    type: 'categorical',
    selectedCategory: null,
    categorySet: null,
    labelsLoading: false,
    mousePos: undefined,
    viewMask: false,
  });

  const handleChangeViewMask = () => {
    setState((state) => ({
      ...state,
      viewMask: !state.viewMask,
    }));
  };

  const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: e.target.value,
    });
  };

  const handleSelectCategory = (categorySet: ICategorySet | null) => (e: any) => {
    if (!categorySet) { return; }

    const category = categorySet.categories.find(x => x.name === e.value);
    if (!category) { return; }

    setState({
      ...state,
      selectedCategory: category,
    });
  };

  const handleSelectCategorySet = (e: any) => {
    const categorySet = props.categorySets.find(x => x.id === e.value);
    setState({
      ...state,
      categorySet: categorySet ? categorySet : null,
    });
  };

  const handleShapeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      shape: e.target.value,
    });
  };

  const markComplete = async () => {
    setState({
      ...state,
      labelsLoading: true,
    });

    const variables = {
      imageId: props.image.id,
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

    await client.mutate({
      mutation: COMPLETE_LABEL_QUEUE_IMAGE,
      variables,
      refetchQueries: [{
        query: GET_IMAGE_DATA,
        variables: {
          imageId: props.image.id,
          projectId: props.projectId,
        },
      }],
      awaitRefetchQueries: true,
    });

    setState(s => ({
      ...s,
      labelsLoading: false,
    }));
  };

  const markInProgress = async () => {
    // todo
  };

  const markCompleteDisabled = () => {
    return labels.length === 0 || labels.some(x => x.modified);
  };

  const saveDisabled = () => {
    return labels.every(x => !x.modified) && !hasDeletedLabels;
  };

  const viewMaskDisabled = () => {
    return !props.image.maskUrl;
  };

  const addLabel = () => {
    console.log('adding label');
    const { categorySet, selectedCategory } = state;

    let label;
    if (categorySet) {
      label = new ImageCategoricalLabel(null, state.shape, categorySet, selectedCategory?.name || null);
    } else {
      label = new ImageCategoricalLabel(null, state.shape, null, null);
    }
    label.modified = true;
    props.addLabel(label);
  };

  const removeLabel = (labelIndex: number) => {
    props.removeLabel(labelIndex);
  };

  const saveLabels = async () => {
    setState({
      ...state,
      labelsLoading: true,
    });

    const variables = {
      imageId: props.image.id,
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

    await client.mutate({
      mutation: SAVE_LABELS,
      variables,
      refetchQueries: [{
        query: GET_IMAGE_DATA,
        variables: {
          imageId: props.image.id,
          projectId: props.projectId,
        },
      }],
      awaitRefetchQueries: true,
    });

    setState({
      ...state,
      labelsLoading: false,
    });
  };

  const zoomIn = () => {
    setState({
      ...state,
      zoom: Math.min(8.0, state.zoom + 0.2),
    });
  };

  const zoomOut = () => {
    setState({
      ...state,
      zoom: Math.max(0.2, state.zoom - 0.2),
    });
  };

  const closePolygon = () => {
    if (!selectedLabel || selectedLabelIndex === null) { return; }

    const label = cloneDeep(selectedLabel);
    const poly = label.shape as MultiPolygon;
    poly.endPolygon();
    props.updateLabel(label, selectedLabelIndex);
  };

  const closePolygonDisabled = () => {
    if (!selectedLabel) {
      return;
    }

    if (selectedLabel == null || selectedLabel.shape == null || !(selectedLabel.shape instanceof MultiPolygon)) {
      return true;
    }
    const multipoly = selectedLabel.shape;
    return !(multipoly.currentPolygon && multipoly.currentPolygon.points.length > 2);
  };

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
    <Button size="small" onClick={markComplete} disabled={markCompleteDisabled()}>{'Complete'}</Button>
  );
  if (labelQueueImage.status === 'complete') {
    approveButton = (
      <Button size="small" onClick={markInProgress}>{'In Progress'}</Button>
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
              <FormGroup row={true}>
                <FormControl>
                  <FormLabel component="legend">Shape</FormLabel>
                  <RadioGroup
                    aria-label="label-shape"
                    name="label-shape"
                    value={state.shape}
                    onChange={handleShapeChange}
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
                    value={state.type}
                    onChange={handleChange('type')}
                    row={true}
                  >
                    <FormControlLabel value="categorical" control={<Radio />} label="Categorical" />
                    <FormControlLabel value="none" control={<Radio />} label="None" disabled={true} />
                  </RadioGroup>
                </FormControl>
              </FormGroup>
              <FormGroup row={true}>
                <FormControl className={classes.formControl}>
                  <Select placeholder="Category Set" options={categorySetOptions} onChange={handleSelectCategorySet} />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <Select placeholder="Category" options={state.categorySet?.categories.map(x => ({
                    value: x.name,
                    label: x.name,
                  }))} onChange={handleSelectCategory(state.categorySet)} />
                </FormControl>
              </FormGroup>
              <FormGroup row={true}>
                <FormControl className={classes.formControl} />
              </FormGroup>
            </form>
            <br />
            {/* <ImageLabelCreate categorySets={props.categorySets} onNewLabel={onNewLabel} /> */}
            <Button variant="contained" color="secondary" size="small" onClick={addLabel}>Add Label</Button>
            <br />
          </Paper>
          <Paper className={classes.labelListContainer}>
            {state.labelsLoading ? (
              <ContentLoading />
            ) : (
                <React.Fragment>
                  <Toolbar disableGutters={true} variant="dense">
                    <Typography variant="h6">
                      {'Labels'}
                    </Typography>
                    <Typography className={classes.grow} />
                    <Button variant="contained" size="small" onClick={saveLabels}
                      disabled={saveDisabled()}
                      color="secondary">
                      {'Save'}
                      <SaveIcon />
                    </Button>
                  </Toolbar>
                  <div className={classes.labelList}>
                    <ImageLabelList />
                  </div>
                </React.Fragment>
              )}
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
              <Button disabled={closePolygonDisabled()} onClick={closePolygon}>{'Close Polygon'}</Button>
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
                {'Mode: labeling'}
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
          <div className={classes.canvasHeader} />
          <div className={classes.canvasContainer} id="canvas-grid">
            <ImageLabelerCanvas
              zoom={state.zoom}
              labels={labels}
              selectedLabel={selectedLabel}
              selectedLabelIndex={selectedLabelIndex}
              imageUrl={props.image.url} />          </div>
          <Paper className={classes.bottomToolbar} >
            <Toolbar variant="dense">
              <Typography>{'Bottom toolbar'}</Typography>
            </Toolbar>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default connector(ImageLabelerContent);
