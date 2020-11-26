import React from 'react';
import { Route } from 'react-router';
import BatchImageLabeler from './ImageCollections/BatchImageLabeler';
import ImageCollectionPage from './ImageCollections/ImageCollectionPage';
import ImageLabeler from './ImageCollections/ImageLabeler';
import ImageViewer from './ImageCollections/ImageViewer';
import ImageReviewer from './ImageCollections/ReviewQueues/ImageReviewer';
import ImageLabelingPage from './ImagelabelingPage';

export default function ImageLabelingRouter() {
  return (
    <React.Fragment>
      <Route exact={true} path="/workspaces/:workspaceId/image-labeling/:tab">
        <ImageLabelingPage />
      </Route>
      <Route
        exact={true}
        path="/workspaces/:workspaceId/image-labeling/collections/:collectionId/batch-labeling/label-batch">
        <BatchImageLabeler />
      </Route>
      <Route
        exact={true}
        path="/workspaces/:workspaceId/image-labeling/collections/:collectionId/:tab">
        <ImageCollectionPage />
      </Route>
      <Route
        exact={true}
        path="/workspaces/:workspaceId/image-labeling/collections/:collectionId/images/:imageId">
        <ImageViewer />
      </Route>
      <Route
        exact={true}
        path="/workspaces/:workspaceId/image-labeling/collections/:collectionId/label-image/:imageId">
        <ImageLabeler />
      </Route>
      <Route
        exact={true}
        path="/workspaces/:workspaceId/image-labeling/collections/:collectionId/review-queues/:queueId/images/:imageId">
        <ImageReviewer />
      </Route>
    </React.Fragment>
  );
}
