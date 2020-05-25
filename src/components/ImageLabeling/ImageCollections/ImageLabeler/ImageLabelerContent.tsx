import { useApolloClient } from '@apollo/react-hooks';
import {
  createStyles,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import SaveIcon from '@material-ui/icons/Save';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ApolloError } from 'apollo-client';
import React, { useState } from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import {
  ICategory,
  ICategorySet,
  IImage,
  IImageLabel,
  ILabelQueueImage,
} from '../../../../models';
import * as actions from '../../../../store/image-labeling/actions';
import {
  deletedSavedLabels,
  getImageLabelingState,
  getLabels,
  getSelectedLabel,
  getSelectedLabelIndex,
} from '../../../../store/image-labeling/selectors';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
import ImageCategoricalLabel, {
  ImageLabelShapesEnum,
} from '../../models/labels/ImageLabel';
import ClosePolygonButton from './ClosePolygonButton';
import ImageLabelList from './ImageLabelList';
import PolygonLabelingCanvas from './PolygonLabelingCanvas';
import {
  COMPLETE_LABEL_QUEUE_IMAGE,
  NEXT_LABEL_QUEUE_IMAGE,
  SAVE_LABELS,
} from './queries';
import RectangleLabelingCanvas from './RectangleLabelingCanvas';
import { convertLabels } from './utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
    },
    labelTools: {
      maxHeight: '100%',
      padding: theme.spacing(1),
      flex: 1,
      flexGrow: 3,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minWidth: 400,
    },
    labelListContainer: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(1),
      overflow: 'hidden',
    },
    labelList: {
      overflow: 'scroll',
    },
    middle: {
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
      backgroundImage:
        'linear-gradient(to right, #757575 50%, #a4a4a4 50%), linear-gradient(to bottom, #757575 50%, #a4a4a4 50%)',
      backgroundBlendMode: 'difference, normal',
      backgroundSize: '2em 2em',
      overflow: 'auto',
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
    grow: {
      flexGrow: 1,
    },
  }),
);

const mapDispatch = {
  addLabel: actions.addLabel,
  removeLabel: actions.removeLabel,
  updateLabel: actions.updateLabel,
  selectLabel: actions.selectLabel,
  resetLabels: actions.resetLabels,
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
  zoom: number;
  loading: boolean;
  apolloError: ApolloError | null;

  // label settings state
  shape: ImageLabelShapesEnum;
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
  const labelingState = useSelector(getImageLabelingState);
  const history = useHistory();
  const client = useApolloClient();

  const { image, labelQueueImage, categorySets } = props;
  const { orgId, projectId, collectionId } = useParams();

  const [state, setState] = useState<IImageLabelerContentState>({
    closePolygonDisabled: true,
    categorySetOpen: false,
    zoom: 1.0,
    loading: false,
    apolloError: null,

    // label settings state
    shape: ImageLabelShapesEnum.BOX,
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

  const handleChange = (name: string) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setState({
      ...state,
      [name]: e.target.value,
    });
  };

  const handleSelectCategory = (categorySet: ICategorySet | null) => (
    e: React.ChangeEvent<{}>,
    value: {
      value: string;
      label: string;
    } | null,
  ) => {
    if (!categorySet) {
      return;
    }

    const category = categorySet.categories.find((x) => x.name === value?.value);
    if (!category) {
      return;
    }

    setState({
      ...state,
      selectedCategory: category,
    });
  };

  const handleSelectCategorySet = (
    e: React.ChangeEvent<{}>,
    value: {
      value: number;
      label: string;
    } | null,
  ) => {
    const categorySet = categorySets.find((x) => x.id === value?.value);
    setState({
      ...state,
      categorySet: categorySet ? categorySet : null,
    });
  };

  const handleShapeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      shape: e.target.value as ImageLabelShapesEnum,
    });
    props.selectLabel(null);
  };

  const markComplete = async () => {
    setState({ ...state, loading: true });

    try {
      const variables = {
        imageId: image.id,
        labels: labels.map((label) => {
          const labelInput: any = {
            shape: label.shape,
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

      await client.mutate({ mutation: COMPLETE_LABEL_QUEUE_IMAGE, variables });
      await goToNextImage();
    } catch (err) {
      console.error(err);
      if (err instanceof ApolloError) {
        setState((s) => ({
          ...s,
          loading: false,
          apolloError: err,
        }));
      }
    }
  };

  const goToNextImage = async () => {
    const { data } = await client.mutate({
      mutation: NEXT_LABEL_QUEUE_IMAGE,
      variables: { collectionId: image.collectionId },
    });

    if (data.ImageLabelingService_nextLabelQueueImage) {
      const nextId = data.ImageLabelingService_nextLabelQueueImage.imageId;
      history.push(
        `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/label-image/${nextId}`,
      );
    } else {
      // the queue is empty so go to collection page
      history.push(
        `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}`,
      );
    }
  };

  const markInProgress = async () => {
    // todo
  };

  const markCompleteDisabled = () => {
    return false;
    // return labels.length === 0 || labels.some((x) => x.modified);
  };

  const saveDisabled = () => {
    return labels.every((x) => !x.modified) && !hasDeletedLabels;
  };

  const viewMaskDisabled = () => {
    return !image.maskUrl;
  };

  const addLabel = () => {
    const { categorySet, selectedCategory } = state;

    let label;
    if (categorySet) {
      label = new ImageCategoricalLabel(
        null,
        state.shape,
        categorySet,
        selectedCategory?.name || null,
      );
    } else {
      label = new ImageCategoricalLabel(null, state.shape, null, null);
    }
    label.modified = true;
    props.addLabel(label);
  };

  const saveLabels = async () => {
    setState((s) => ({
      ...s,
      labelsLoading: true,
    }));

    const variables = {
      imageId: image.id,
      labels: labels.map((label) => {
        const labelInput: any = {
          shape: label.shapeType,
          categorySetId: label.categorySetId,
          category: label.category,
          value: label.toJson(),
        };

        if (label.id) {
          labelInput.id = label.id;
        }
        return labelInput;
      }),
      delLabelIds: labelingState.deletedLabelIds,
    };

    try {
      interface ISaveLabels {
        ImageLabelingService_saveImageLabels: IImageLabel[];
      }
      const res = await client.mutate<ISaveLabels>({
        mutation: SAVE_LABELS,
        variables,
      });

      if (res.data) {
        const labels = convertLabels(
          res.data.ImageLabelingService_saveImageLabels,
        );
        props.resetLabels(labels);
      }

      setState((s) => ({
        ...s,
        labelsLoading: false,
      }));
    } catch (err) {
      console.error(err);
      if (err instanceof ApolloError) {
        setState((s) => ({
          ...s,
          labelsLoading: false,
          apolloError: err,
        }));
      }
    }
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

  if (state.loading) {
    return <ContentLoading />;
  }

  if (state.apolloError) {
    return <ApolloErrorPage error={state.apolloError} />;
  }

  let selectedLabelInfo;
  if (selectedLabel) {
    selectedLabelInfo = (
      <React.Fragment>
        <Typography color="inherit" className={classes.infobarItem}>
          {selectedLabel.id ? `Label Id=${selectedLabel.id}` : 'New Label'}
        </Typography>
        <Typography color="inherit" className={classes.infobarItem}>
          {`Label Shape=${selectedLabel.shape}`}
        </Typography>
      </React.Fragment>
    );
  }

  let approveButton = (
    <Button
      size="small"
      onClick={markComplete}
      disabled={markCompleteDisabled()}>
      {'Complete'}
    </Button>
  );
  if (labelQueueImage.status === 'complete') {
    approveButton = (
      <Button size="small" onClick={markInProgress}>
        {'In Progress'}
      </Button>
    );
  }

  const getCurrentLabelShape = () => {
    return selectedLabel?.shapeType ?? state.shape;
  };

  const categorySetOptions = categorySets.map((x) => ({
    value: x.id,
    label: x.name,
  }));

  const categoryOptions = state.categorySet
    ? state.categorySet.categories.map((x) => ({
        value: x.name,
        label: x.name,
      }))
    : [];

  let labelingCanvas;
  switch (getCurrentLabelShape()) {
    case ImageLabelShapesEnum.BOX:
      labelingCanvas = (
        <RectangleLabelingCanvas
          zoom={state.zoom}
          labels={labels}
          selectedLabel={selectedLabel}
          selectedLabelIndex={selectedLabelIndex}
          imageUrl={image.url}
        />
      );
      break;
    default:
      labelingCanvas = (
        <PolygonLabelingCanvas
          zoom={state.zoom}
          labels={labels}
          selectedLabel={selectedLabel}
          selectedLabelIndex={selectedLabelIndex}
          imageUrl={image.url}
        />
      );
      break;
  }

  return (
    <div className={classes.root}>
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
                  row={true}>
                  <FormControlLabel
                    value="box"
                    control={<Radio />}
                    label="Bounding Box"
                  />
                  <FormControlLabel
                    value="polygon"
                    control={<Radio />}
                    label="Polygon"
                  />
                  <FormControlLabel
                    value="none"
                    control={<Radio />}
                    label="None"
                  />
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
                  row={true}>
                  <FormControlLabel
                    value="categorical"
                    control={<Radio />}
                    label="Categorical"
                  />
                  <FormControlLabel
                    value="none"
                    control={<Radio />}
                    label="None"
                    disabled={true}
                  />
                </RadioGroup>
              </FormControl>
            </FormGroup>
            <FormGroup row={true}>
              <FormControl className={classes.formControl}>
                <Autocomplete
                  onChange={handleSelectCategorySet}
                  options={categorySetOptions}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category Sets"
                    />
                  )}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <Autocomplete
                  onChange={handleSelectCategory(state.categorySet)}
                  options={categoryOptions}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                    />
                  )}
                />
              </FormControl>
            </FormGroup>
            <FormGroup row={true}>
              <FormControl className={classes.formControl} />
            </FormGroup>
          </form>
          <br />
          {/* <ImageLabelCreate categorySets={categorySets} onNewLabel={onNewLabel} /> */}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={addLabel}>
            Add Label
          </Button>
          <br />
        </Paper>
        <Paper className={classes.labelListContainer}>
          {state.labelsLoading ? (
            <ContentLoading />
          ) : (
            <React.Fragment>
              <Toolbar disableGutters={true} variant="dense">
                <Typography variant="h6">{'Labels'}</Typography>
                <Typography className={classes.grow} />
                <Button
                  variant="contained"
                  size="small"
                  onClick={saveLabels}
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
            <Button
              size="small"
              variant="contained"
              className={classes.marginRight}
              onClick={zoomIn}
              color="secondary">
              <ZoomInIcon />
            </Button>
            <Button
              size="small"
              variant="contained"
              className={classes.marginRight}
              onClick={zoomOut}
              color="secondary">
              <ZoomOutIcon />
            </Button>
            <ClosePolygonButton />
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
        <div className={classes.canvasContainer} id="canvas-grid">
          {labelingCanvas}
        </div>
        <Paper className={classes.infobar}>
          <Toolbar variant="dense">
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
      </div>
    </div>
  );
};

export default connector(ImageLabelerContent);
