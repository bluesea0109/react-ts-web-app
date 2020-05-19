import React, { useState } from 'react';
import { Typography, makeStyles, createStyles, Theme, useTheme } from '@material-ui/core';
import gql from "graphql-tag";
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import Button from '@material-ui/core/Button';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useApolloClient } from 'react-apollo';
import ImageCanvas from './ImageCanvas';
import { GraphQLError } from 'graphql';
import ContentLoading from '../../../ContentLoading';
import ImageCategoricalLabel from '../../models/labels/ImageLabel';

const NEXT_IMAGE = gql`
  query ($imageId: Int!, $unlabeled: Boolean) {
    ImageLabelingService_nextImage(imageId: $imageId, unlabeled: $unlabeled) {
      id
    }
  }
`;

const PREV_IMAGE = gql`
  query ($imageId: Int!, $unlabeled: Boolean) {
    ImageLabelingService_prevImage(imageId: $imageId, unlabeled: $unlabeled) {
      id
    }
  }
`;

const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    content: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      flex: 1,
    },
    canvasHeader: {
      marginTop: theme.spacing(1)
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
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      flexGrow: 10,
      flex: 1
    },
    canvasContainer: {
      backgroundImage: "linear-gradient(to right, #757575 50%, #a4a4a4 50%), linear-gradient(to bottom, #757575 50%, #a4a4a4 50%)",
      backgroundBlendMode: "difference, normal",
      backgroundSize: "2em 2em",
      overflow: 'scroll',
      flex: '1 1 auto',
      height: 0
    },
    labelListContainer: {
      marginTop: theme.spacing(1),
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
    bottomToolbar: {
    }
  })
);

interface IImageViewerContentProps {
  image: any,
  labelQueueImage: any,
  labels: ImageCategoricalLabel[]
  categorySets?: any[]
}

const ImageViewerContent: React.FC<IImageViewerContentProps> = (props) => {
  const classes = styles();
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();
  const client = useApolloClient();
  const { image, labelQueueImage, labels } = props;
  const imageId = image.id;
  const { orgId, projectId, collectionId } = useParams();

  interface IState {
    zoom: number,
    imageLoaded: boolean,
    viewMask: boolean,
    loading: boolean,
    error: GraphQLError | null,
  }
  const [state, setState] = useState<IState>({
    zoom: 1.0,
    imageLoaded: false,
    viewMask: false,
    loading: false,
    error: null,
  });

  const handleChangeViewMask = () => {
    setState(s => ({
      ...s,
      viewMask: !state.viewMask
    }))
  }

  const drawLabels = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    for (const label of labels) {
      if (label.visible) {
        label.draw(ctx, state.zoom);
      }
    }
  }

  const drawImage = (canvas: HTMLCanvasElement) => {
    if (!state.imageLoaded) {
      return;
    }
    const img = document.getElementById('image') as HTMLImageElement;
    const ctx = canvas.getContext('2d');
    const w = img.width * state.zoom;
    const h = img.height * state.zoom;
    canvas.width = w;
    canvas.height = h;
    ctx?.drawImage(img, 0, 0, w, h);
  }

  const draw = () => {
    if (!state.imageLoaded) return;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    drawImage(canvas);
    drawLabels(canvas);
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

  // const toggleLabelVisible = (label: ImageCategoricalLabel) => () => {
  //   label.visible = !label.visible;
  //   setState(state);
  // };

  // const toggleLabelExpand = (label: ImageCategoricalLabel) => () => {
  //   label.open = !label.open;
  //   setState(state);
  // };

  const prevImage = async (unlabeled: boolean | null = null) => {
    setState({
      ...state,
      loading: true
    })

    const { data, errors } = await client.query({
      query: PREV_IMAGE,
      variables: { imageId, unlabeled },
      fetchPolicy: 'network-only'
    });

    if (errors?.[0]) {
      setState(s => ({
        ...s,
        loading: false,
        error: errors[0]
      }));
    } else {
      goToImage(data.ImageLabelingService_prevImage?.id);
    }
  }

  const nextImage = async (unlabeled: boolean | null = null) => {
    setState({
      ...state,
      loading: true
    })

    const { data, errors } = await client.query({
      query: NEXT_IMAGE,
      variables: { imageId, unlabeled },
      fetchPolicy: 'network-only'
    });

    if (errors?.[0]) {
      setState(s => ({
        ...s,
        loading: false,
        error: errors[0]
      }));
    } else {
      goToImage(data.ImageLabelingService_nextImage?.id);
    }
  }

  const goToImage = (imageId: number) => {
    if (imageId) {
      history.push({
        pathname: `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/images/${imageId}`,
        search: location.search
      });
    }
  }

  const labelThisImage = async () => {
    setState(s => ({
      ...s,
      loading: true
    }));

    const { errors } = await client.mutate({
      mutation: SET_LABEL_QUEUE_IMAGE_IN_PROGRESS,
      variables: {
        imageId
      }
    });

    if (errors?.[0]) {
      setState(s => ({
        ...s,
        error: errors[0],
        loading: false
      }));
      return;
    }

    history.push({
      pathname: `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/label-image/${imageId}`,
    });
  }

  if (state.loading) {
    return <ContentLoading />
  }
  draw();

  let url = image.url;
  if (state.viewMask) {
    url = image.maskUrl;
  }
  const approvedBy = (
    <>
      <Typography style={{ marginRight: theme.spacing(1) }}>
        <strong>{"Approved By: "}</strong>{image.approvedBy.length ? image.approvedBy.join(", ") : "Unapproved"}
      </Typography>
    </>
  );

  let labelInfo;
  if (labelQueueImage) {
    labelInfo = (
      <React.Fragment>
        <Typography style={{ marginRight: theme.spacing(1) }}>
          <strong>{"Labeler: "}</strong>{labelQueueImage.labeler}
        </Typography>
        <Typography style={{ marginRight: theme.spacing(1) }}>
          <strong>{"Label Status: "}</strong>{labelQueueImage.status}
        </Typography>
      </React.Fragment>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.labelTools}>
          <Paper>
            <Toolbar variant="dense">
              <Typography variant="h6">
                {"Image Viewer"}
              </Typography>
            </Toolbar>
          </Paper>
          <Paper className={classes.labelListContainer}>
            {state.loading ? (
              <ContentLoading />
            ) : (
                <React.Fragment>
                  <Toolbar variant="dense">
                    <Typography variant="h6">
                      {"Labels"}
                    </Typography>
                  </Toolbar>
                  <div className={classes.labelList}>
                    {/* <List component="nav">
                      {labels.map((label, i) => {
                        return (
                          <ImageLabelListItem key={i} label={label} labelIndex={i} nonSelectable={true} />
                        );
                      })}
                    </List> */}
                  </div>
                </React.Fragment>
              )}
          </Paper>
        </div>
        <div className={classes.middle}>
          <Toolbar variant="dense" disableGutters={true}>
            <Button size="small" variant="contained" className={classes.marginRight} onClick={zoomIn} color="secondary">
              <ZoomInIcon />
            </Button>
            <Button size="small" variant="contained" className={classes.marginRight} onClick={zoomOut} color="secondary">
              <ZoomOutIcon />
            </Button>
            <Button size="small" color="secondary" className={classes.marginRight} variant="contained" onClick={() => prevImage()}>
              <NavigateBeforeIcon />
            </Button>
            <Button color="secondary" size="small" className={classes.marginRight} variant="contained" onClick={() => nextImage()}>
              <NavigateNextIcon />
            </Button>
            <Button color="secondary" size="small" className={classes.marginRight} variant="contained" onClick={() => prevImage(true)}>
              <NavigateBeforeIcon />{"Unlabeled"}
            </Button>
            <Button color="secondary" size="small" className={classes.marginRight} variant="contained" onClick={() => nextImage(true)}>
              {"Unlabeled"}<NavigateNextIcon />
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={state.viewMask}
                  onChange={handleChangeViewMask}
                  color="secondary"
                  disabled={!image.maskUrl}
                />
              }
              label="View Mask"
            />
            <Typography className={classes.grow} />
            <Button color="secondary" size="small" onClick={labelThisImage}>{"Label this Image"}</Button>
          </Toolbar>
          <div className={classes.canvasHeader}>
            <Typography>
              {`Zoom Level: ${state.zoom.toFixed(1)}`}
            </Typography>
          </div>
          <ImageCanvas imageUrl={url} zoom={state.zoom} labels={labels} />
          <Paper className={classes.bottomToolbar}>
            <Toolbar variant="dense">
              {labelInfo}
              {approvedBy}
            </Toolbar>
          </Paper>
        </div>
      </div>
    </div>
  );
}


const SET_LABEL_QUEUE_IMAGE_IN_PROGRESS = gql`
  mutation ($imageId: Int!) {
    ImageLabelingService_selectLabelQueueImage(imageId: $imageId) {
      imageId
      status
      labeler
    }
  }
`;

export default ImageViewerContent;
