import { useApolloClient } from '@apollo/client';
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getLabels } from '../../../../store/image-labeling/selectors';
import ContentLoading from '../../../ContentLoading';
import ImageCategoricalLabel from '../../models/labels/ImageLabel';
import ImageLabelList from '../ImageLabelList';
import ImageCanvas from './ImageCanvas';

const NEXT_IMAGE = gql`
  query($imageId: Int!, $unlabeled: Boolean) {
    ImageLabelingService_nextImage(imageId: $imageId, unlabeled: $unlabeled) {
      id
    }
  }
`;

const PREV_IMAGE = gql`
  query($imageId: Int!, $unlabeled: Boolean) {
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
      flexDirection: 'column',
    },
    content: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      flex: 1,
    },
    canvasHeader: {
      marginTop: theme.spacing(1),
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
      flex: 1,
    },
    canvasContainer: {
      backgroundImage:
        'linear-gradient(to right, #757575 50%, #a4a4a4 50%), linear-gradient(to bottom, #757575 50%, #a4a4a4 50%)',
      backgroundBlendMode: 'difference, normal',
      backgroundSize: '2em 2em',
      overflow: 'scroll',
      flex: '1 1 auto',
      height: 0,
    },
    labelListContainer: {
      marginTop: theme.spacing(1),
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
    canvas: {},
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
    bottomToolbar: {},
  }),
);

interface IImageViewerContentProps {
  image: any;
  labelQueueImage: any;
  labels: ImageCategoricalLabel[];
  categorySets?: any[];
}

const ImageViewerContent: React.FC<IImageViewerContentProps> = (props) => {
  const classes = styles();
  const theme = useTheme();
  const history = useHistory();
  const client = useApolloClient();
  const { image, labelQueueImage } = props;
  const imageId = image.id;
  const { orgId, projectId, collectionId } = useParams<{
    orgId: string;
    projectId: string;
    collectionId: string;
  }>();
  const labels = useSelector(getLabels);

  interface IState {
    zoom: number;
    imageLoaded: boolean;
    viewMask: boolean;
    loading: boolean;
    error: GraphQLError | null;
  }
  const [state, setState] = useState<IState>({
    zoom: 1.0,
    imageLoaded: false,
    viewMask: false,
    loading: false,
    error: null,
  });

  const handleChangeViewMask = () => {
    setState((s) => ({
      ...s,
      viewMask: !state.viewMask,
    }));
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

  const prevImage = async (unlabeled: boolean | null = null) => {
    setState({
      ...state,
      loading: true,
    });

    const { data, errors } = await client.query({
      query: PREV_IMAGE,
      variables: { imageId, unlabeled },
      fetchPolicy: 'network-only',
    });

    if (errors?.[0]) {
      setState((s) => ({
        ...s,
        loading: false,
        error: errors[0],
      }));
    } else {
      goToImage(data.ImageLabelingService_prevImage?.id);
    }
  };

  const nextImage = async (unlabeled: boolean | null = null) => {
    setState({
      ...state,
      loading: true,
    });

    const { data, errors } = await client.query({
      query: NEXT_IMAGE,
      variables: { imageId, unlabeled },
      fetchPolicy: 'network-only',
    });

    if (errors?.[0]) {
      setState((s) => ({
        ...s,
        loading: false,
        error: errors[0],
      }));
    } else {
      goToImage(data.ImageLabelingService_nextImage?.id);
    }
  };

  const goToImage = (imageId: number) => {
    if (imageId) {
      history.push({
        pathname: `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/images/${imageId}`,
      });
    } else {
      history.push({
        pathname: `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/images`,
      });
    }
  };

  const labelThisImage = async () => {
    setState((s) => ({
      ...s,
      loading: true,
    }));

    const { errors } = await client.mutate({
      mutation: SET_LABEL_QUEUE_IMAGE_IN_PROGRESS,
      variables: {
        imageId,
      },
    });

    if (errors?.[0]) {
      setState((s) => ({
        ...s,
        error: errors[0],
        loading: false,
      }));
      return;
    }

    history.push({
      pathname: `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/label-image/${imageId}`,
    });
  };

  if (state.loading) {
    return <ContentLoading />;
  }

  let url = image.url;
  if (state.viewMask) {
    url = image.maskUrl;
  }
  const approvedBy = (
    <>
      <Typography style={{ marginRight: theme.spacing(1) }}>
        <strong>{'Approved By: '}</strong>
        {image.approvedBy.length ? image.approvedBy.join(', ') : 'Unapproved'}
      </Typography>
    </>
  );

  let labelInfo;
  if (labelQueueImage) {
    labelInfo = (
      <React.Fragment>
        <Typography style={{ marginRight: theme.spacing(1) }}>
          <strong>{'Labeler: '}</strong>
          {labelQueueImage.labeler}
        </Typography>
        <Typography style={{ marginRight: theme.spacing(1) }}>
          <strong>{'Label Status: '}</strong>
          {labelQueueImage.status}
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
              <Typography variant="h6">{'Image Viewer'}</Typography>
            </Toolbar>
          </Paper>
          <Paper className={classes.labelListContainer}>
            {state.loading ? (
              <ContentLoading />
            ) : (
              <React.Fragment>
                <Toolbar variant="dense">
                  <Typography variant="h6">{'Labels'}</Typography>
                </Toolbar>
                <div className={classes.labelList}>
                  <ImageLabelList />
                </div>
              </React.Fragment>
            )}
          </Paper>
        </div>
        <div className={classes.middle}>
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
            <Button
              size="small"
              color="secondary"
              className={classes.marginRight}
              variant="contained"
              onClick={() => prevImage()}>
              <NavigateBeforeIcon />
            </Button>
            <Button
              color="secondary"
              size="small"
              className={classes.marginRight}
              variant="contained"
              onClick={() => nextImage()}>
              <NavigateNextIcon />
            </Button>
            <Button
              color="secondary"
              size="small"
              className={classes.marginRight}
              variant="contained"
              onClick={() => prevImage(true)}>
              <NavigateBeforeIcon />
              {'Unlabeled'}
            </Button>
            <Button
              color="secondary"
              size="small"
              className={classes.marginRight}
              variant="contained"
              onClick={() => nextImage(true)}>
              {'Unlabeled'}
              <NavigateNextIcon />
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
            <Button color="secondary" size="small" onClick={labelThisImage}>
              {'Label this Image'}
            </Button>
          </Toolbar>
          <div className={classes.canvasHeader}>
            <Typography>{`Zoom Level: ${state.zoom.toFixed(1)}`}</Typography>
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
};

const SET_LABEL_QUEUE_IMAGE_IN_PROGRESS = gql`
  mutation($imageId: Int!) {
    ImageLabelingService_selectLabelQueueImage(imageId: $imageId) {
      imageId
      status
      labeler
    }
  }
`;

export default ImageViewerContent;
