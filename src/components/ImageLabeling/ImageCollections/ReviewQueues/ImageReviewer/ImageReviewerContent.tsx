import React, { useState } from 'react';
import { makeStyles, Theme, createStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import { ICategorySet, IImage, IReviewQueueImage } from '../../../../../models';
import * as actions from '../../../../../store/image-labeling/actions';
import IconButtonZoomIn from '../../../../IconButtons/IconButtonZoomIn';
import IconButtonZoomOut from '../../../../IconButtons/IconButtonZoomOut';
import ImageCanvas from '../../ImageViewer/ImageCanvas';
import { getLabels } from '../../../../../store/image-labeling/selectors';
import ImageLabelList from '../../ImageLabelList';
import { useMutation } from 'react-apollo';
import { APPROVE_REVIEW_QUEUE_IMAGE } from './gql-queries';
import ContentLoading from '../../../../ContentLoading';
import ApolloErrorPage from '../../../../ApolloErrorPage';
import { NEXT_REVIEW_QUEUE_IMAGE } from '../gql-queries';

const useStyles = makeStyles((theme: Theme) =>
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
      backgroundImage: 'linear-gradient(to right, #757575 50%, #a4a4a4 50%), linear-gradient(to bottom, #757575 50%, #a4a4a4 50%)',
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
    canvas: {
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
    bottomToolbar: {
    },
  }),
);

const mapDispatch = {
  updateLabel: actions.updateLabel,
};

const connector = connect(null, mapDispatch);

interface IImageReviewerContentProps extends ConnectedProps<typeof connector> {
  categorySets: ICategorySet[];
  image: IImage;
  reviewQueueImage: IReviewQueueImage;
}

function ImageReviewerContent(props: IImageReviewerContentProps) {
  const labels = useSelector(getLabels);
  const theme = useTheme();
  const { image } = props;
  const classes = useStyles();
  const { orgId, projectId, collectionId, queueId } = useParams();
  const [state, setState] = useState({
    loading: false,
    zoom: 1.0,
  });
  const history = useHistory();
  const [approveImage, approveImageResult] = useMutation(APPROVE_REVIEW_QUEUE_IMAGE);
  const [disapproveImage, disapproveImageResult] = useMutation(APPROVE_REVIEW_QUEUE_IMAGE);
  const [nextImage, nextImageResult] = useMutation(NEXT_REVIEW_QUEUE_IMAGE);

  const approve = async () => {
    setState({ ...state, loading: true });
    // todo;

    await approveImage({
      variables: { queueId: parseInt(queueId, 10), imageId: image.id }
    });

    const res = await nextImage({
      variables: { queueId: parseInt(queueId, 10) }
    });

    if (res.data) {
      const nextImageId = res.data.ImageLabelingService_nextReviewQueueImage?.imageId;
      if (nextImageId == null) {
        // end of queue;
        history.push(`/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/review-queues`);
      } else {
        history.push(`/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/review-queues/${queueId}/images/${nextImageId}`);
      }
    } else {
      setState({ ...state, loading: false });
    }
  }

  const disapprove = async () => {
    setState({ ...state, loading: true });
    // todo;

    await disapproveImage({
      variables: { queueId: parseInt(queueId, 10), imageId: image.id }
    });

    const res = await nextImage({
      variables: { queueId: parseInt(queueId, 10) }
    });

    if (res.data) {
      const nextImageId = res.data.ImageLabelingService_nextReviewQueueImage?.imageId;
      if (nextImageId == null) {
        // end of queue;
        history.push(`/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/review-queues`);
      } else {
        history.push(`/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/review-queues/${queueId}/images/${nextImageId}`);
      }
    } else {
      setState({ ...state, loading: false });
    }
  }

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

  const apolloError = approveImageResult.error || disapproveImageResult.error || nextImageResult.error;
  if (apolloError) {
    return <ApolloErrorPage error={apolloError} />;
  }

  const loading = state.loading || approveImageResult.loading || disapproveImageResult.loading || nextImageResult.loading;
  if (loading) {
    return <ContentLoading />;
  }

  const approvedBy = (
    <>
      <Typography style={{ marginRight: theme.spacing(1) }}>
        <strong>{'Approved By: '}</strong>{image.approvedBy.length ? image.approvedBy.join(', ') : 'Unapproved'}
      </Typography>
    </>
  );

  const approveButton = (
    <Button className={classes.marginRight} size="small" onClick={approve}>{"Approve"}</Button>
  );

  const disapproveButton = (
    <Button size="small" onClick={disapprove}>{"Disapprove"}</Button>
  );

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.labelTools}>
          <Paper>
            <Toolbar variant="dense">
              <Typography variant="h6">
                {"Review Image Labels"}
              </Typography>
            </Toolbar>
          </Paper>
          <Paper className={classes.labelListContainer}>
            <React.Fragment>
              <Toolbar variant="dense">
                <Typography variant="h6">
                  {"Labels"}
                </Typography>
              </Toolbar>
              <div className={classes.labelList}>
                <ImageLabelList />
              </div>
            </React.Fragment>
          </Paper>
        </div>
        <div className={classes.middle}>
          <Paper>
            <Toolbar variant="dense" disableGutters={true}>
              <IconButtonZoomIn onClick={zoomIn} />
              <IconButtonZoomOut onClick={zoomOut} />
              <div className={classes.grow} />
              {approveButton}
              {disapproveButton}
            </Toolbar>
          </Paper>
          <div className={classes.canvasHeader}>
            <Typography>
              {`Zoom Level: ${state.zoom}`}
            </Typography>
          </div>
          <ImageCanvas zoom={state.zoom} imageUrl={image.url} labels={labels} />
          <Paper>
            <Toolbar variant="dense">
              {approvedBy}
            </Toolbar>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default connector(ImageReviewerContent);
