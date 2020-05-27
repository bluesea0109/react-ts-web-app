import React, { Component } from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ContentLoading from './ContentLoading';
import { Typography } from '@material-ui/core';
import gql from "graphql-tag";
import List from '@material-ui/core/List';
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import { getImageLabelsState } from '../redux/selectors';
import { connect } from 'react-redux';
import {
  setImageLabels,
  zoomIn, zoomOut
} from '../redux/actions';
import ImageLabelListItem from './ImageLabelListItem';
import { getCurrentUser } from "../redux/selectors";
import IconButtonZoomIn from './IconButtonZoomIn';
import IconButtonZoomOut from './IconButtonZoomOut';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import { graphql } from 'react-apollo';

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  toolbar: {
    marginTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit
  },
  canvasHeader: {
    marginTop: theme.spacing.unit
  },
  paper: {
    padding: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  paperBottom: {
    padding: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 8,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flex: 1,
    //flexGrow: 1,
  },
  labelTools: {
    padding: theme.spacing.unit,
    flex: 1,
    flexGrow: 3,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    minWidth: 400,
  },
  middle: {
    marginBottom: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    flexGrow: 10,
    flex: 1
  },
  canvasContainer: {
    // backgroundImage: "linear-gradient(to right, #757575 50%, #a4a4a4 50%), linear-gradient(to bottom, #757575 50%, #a4a4a4 50%)",
    // backgroundBlendMode: "difference, normal",
    // backgroundSize: "2em 2em",
    display: 'flex',
    flexDirection: 'column',
    //justifyContent: 'center',
    //alignItems: 'center',
    overflow: 'auto',
    flexGrow: 1,
    flex: 1
  },
  labelListContainer: {
    marginTop: theme.spacing.unit,
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
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    // marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 150,
  },
  listItemModified: {
    borderLeft: `2px solid red !important`,
    //background: `#d50000 !important`
  },
  margin: {
    margin: theme.spacing.unit
  },
  marginRight: {
    marginRight: theme.spacing.unit
  },
  checkbox: {
    padding: 0
  },
  iconButton: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  grow: {
    flexGrow: 1,
  },
});

class ImagePageContent extends Component {
  state = {
    zoom: 1.0,
    imageLoaded: false,
  };

  drawLabels = (canvas) => {
    const ctx = canvas.getContext('2d');
    const labels = this.props.labelState.labels;
    for (const label of labels) {
      if (label.visible) {
        label.draw(ctx, this.props.labelState.zoom);
      }
    }
  }

  handleImageLoad = () => {
    this.setState({
      imageLoaded: true
    });
  }

  drawImage = (canvas) => {
    if (!this.state.imageLoaded) {
      return;
    }
    const zoom = this.props.labelState.zoom;
    const img = document.getElementById('image');
    const ctx = canvas.getContext('2d');
    const w = img.width * zoom;
    const h = img.height * zoom;
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
  }

  draw = () => {
    if (!this.state.imageLoaded) {
      return;
    }
    const canvas = document.getElementById('canvas');
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawImage(canvas);
    this.drawLabels(canvas);
  }

  zoomIn = () => {
    this.setState((state) => {
      const zoom = Math.min(8.0, state.zoom + 0.2);
      return {
        zoom
      }
    });
  }

  zoomOut = () => {
    this.setState((state) => {
      const zoom = Math.max(0.2, state.zoom - 0.2);
      return {
        zoom
      }
    });
  }

  componentDidMount() {
    this.props.setImageLabels(this.props.labels);
  }

  toggleLabelVisible = (label, i) => (e) => {
    label.visible = !label.visible;
    this.forceUpdate();
    e.preventDefault();
    e.stopPropagation();
  };

  toggleLabelExpand = (label) => () => {
    label.open = !label.open;
    this.forceUpdate();
  };

  goToImage = (itemId) => {
    if (itemId) {
      const projectId = this.props.match.params.projectId;
      const collectionId = this.props.match.params.collectionId;
      const queueId = this.props.match.params.queueId;
      this.props.history.push(`/app/projects/${projectId}/collections/${collectionId}/queues/${queueId}/images/${itemId}`);
    }
  }

  runQuery = async (query, variables) => {
    this.setState({
      loading: true
    });
    const { data, error } = await this.props.client.query({
      query,
      variables,
      options: {
        fetchPolicy: 'network-only'
      }
    });
    this.setState({
      loading: false
    });

    if (error) {
      this.setState({
        error
      })
      return;
    }
    return data;
  }

  handleShapeChange = (e) => {
    this.setState({
      shape: e.target.value
    });
  }

  approve = async () => {
    const { queueId, itemId } = this.props.match.params;

    this.setState({
      loading: true
    });
    const approve = await this.props.reviewQueueItemApprove({
      variables: {
        queueId: parseInt(queueId),
        itemId: parseInt(itemId)
      }
    });

    if (approve.error) {
      this.setState({
        loading: false,
        error: approve.error
      });
      return;
    }

    if (approve.data && approve.data.reviewQueueItemApprove) {
      await this.goToNextImage();
    }
  }

  disapprove = async () => {
    const { queueId, itemId } = this.props.match.params;

    this.setState({
      loading: true
    });
    const { data, error } = await this.props.reviewQueueItemDisapprove({
      variables: {
        queueId: parseInt(queueId),
        itemId: parseInt(itemId)
      }
    });

    if (error) {
      this.setState({
        loading: false,
        error
      });
      return;
    }

    if (data && data.reviewQueueItemDisapprove) {
      await this.goToNextImage();
    }
  }

  goToNextImage = async () => {
    const { projectId, collectionId, queueId } = this.props.match.params;

    this.setState({
      loading: true
    });
    const { data, error } = await this.props.reviewQueueItemNext({
      variables: {
        queueId: parseInt(queueId),
      }
    });

    if (error) {
      this.setState({
        loading: false,
        error
      });
      return;
    }

    if (data && data.reviewQueueItemNext) {
      const nextId = data.reviewQueueItemNext.itemId;
      this.props.history.push(`/app/projects/${projectId}/collections/${collectionId}/queues/${queueId}/images/${nextId}`);
    } else {
      // the queue is empty, go to collection page
      this.props.history.push(`/app/projects/${projectId}/collections/${collectionId}`);
    }
  }

  render() {
    if (this.state.loading) {
      return <ContentLoading/>
    }
    this.draw();

    const { classes, theme, item } = this.props;

    

    const url = this.props.item.url;
    const { labels } = this.props.labelState;

    let approvedBy = (
      <Typography>{"Unapproved"}</Typography>
    );
    if (item.approvedBy.length) {
      approvedBy = (
        <React.Fragment>
          <Typography style={{ marginRight: theme.spacing.unit }}>{"Approved By"}</Typography>
          <Typography>{item.approvedBy.join(", ")}</Typography>
        </React.Fragment>
      );
    }

    const approveButton = (
      <PrimaryButton className={classes.marginRight} size="small" onClick={this.approve}>{"Approve"}</PrimaryButton>
    );

    const disapproveButton = (
      <SecondaryButton size="small" onClick={this.disapprove}>{"Disapprove"}</SecondaryButton>
    );

    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.labelTools}>
            <Paper>
              <Toolbar variant="dense">
                <Typography variant="h6">
                  {"Image Label Reviewer"}
                </Typography>
              </Toolbar>
            </Paper>
            <Paper className={classes.labelListContainer}>
              {this.state.labelsLoading ? (
                <ContentLoading />
              ) : (
                  <React.Fragment>
                    <Toolbar variant="dense">
                      <Typography variant="h6">
                        {"Labels"}
                      </Typography>
                    </Toolbar>
                    <div className={classes.labelList}>
                      <List component="nav">
                        {labels.map((label, i) => {
                          return (
                            <ImageLabelListItem key={i} label={label} labelIndex={i} nonSelectable={true}/>
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
                <IconButtonZoomIn className={classes.toolbarButton} onClick={this.props.zoomIn} />
                <IconButtonZoomOut className={classes.toolbarButton} onClick={this.props.zoomOut} />
                <div className={classes.grow} />
                {approveButton}
                {disapproveButton}
              </Toolbar>
            </Paper>
            <div className={classes.canvasHeader}>
              <Typography>
                {`Zoom Level: ${this.props.labelState.zoom.toFixed(1)}`}
              </Typography>
            </div>
            <div className={classes.canvasContainer}>
              <div id="canvas-grid">
                <canvas id="canvas" className={classes.canvas} onClick={this.onCanvasClick}>
                  <img id="image" src={url} onLoad={this.handleImageLoad} alt="item" className={classes.image} />
                </canvas>
              </div>
            </div>
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
}

ImagePageContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

const reviewQueueItemNext = gql`
  mutation ($queueId: Int!) {
    reviewQueueItemNext(queueId: $queueId) {
      itemId
    }
  }
`;

const reviewQueueItemApprove = gql`
  mutation ($queueId: Int!, $itemId: Int!) {
    reviewQueueItemApprove(queueId: $queueId, itemId: $itemId) {
      itemId
    }
  }
`;

const reviewQueueItemDisapprove = gql`
  mutation ($queueId: Int!, $itemId: Int!) {
    reviewQueueItemDisapprove(queueId: $queueId, itemId: $itemId) {
      status
    }
  }
`;

const mapStateToProps = state => {
  const labelState = getImageLabelsState(state);
  return {
    labelState,
    currentUser: getCurrentUser(state)
  }
};

export default compose(
  withRouter,
  withStyles(styles, { withTheme: true }),
  graphql(reviewQueueItemNext, { name: 'reviewQueueItemNext' }),
  graphql(reviewQueueItemApprove, { name: 'reviewQueueItemApprove' }),
  graphql(reviewQueueItemDisapprove, { name: 'reviewQueueItemDisapprove' }),
  connect(mapStateToProps, { setImageLabels, zoomIn, zoomOut }),
)(ImagePageContent);
