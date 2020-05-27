import React, { Component } from 'react';
import ContentLoading from './ContentLoading';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ImageCategoricalLabel from '../labels/ImageLabel';
import ErrorPage from './ErrorPage';
import ReviewQueueImagePage from './ReviewQueueImagePage';

const getData = gql`
  query ($collectionId: String!, $queueId: Int!, $itemId: Int!) {
    item(itemId: $itemId) {
      collectionId
      name
      url
      approvedBy
    }
    reviewQueueItem(queueId: $queueId, itemId: $itemId) {
      queueId
      itemId
      reviewer
      status
    }
    categorySets(collectionId: $collectionId) {
      id,
      name,
      categories {
        name
      }
    }
    imageLabels(itemId: $itemId) {
      id
      itemId
      shape
      category
      categorySet {
        id,
        name
      }
      value
      creator
    }
  }
`;


class ReviewQueueImagePageBase extends Component {

  loadLabels = (imageLabels) => {
    
    const labels = [];
    for (const labelData of imageLabels) {
      const label = ImageCategoricalLabel.fromServerData(labelData);
      labels.push(label);
    }
    return labels;
  }

  render() {
    return (
      <Query
        query={getData} variables={{
          collectionId: this.props.match.params.collectionId,
          queueId: parseInt(this.props.match.params.queueId),
          itemId: parseInt(this.props.match.params.itemId),
        }} fetchPolicy='network-only'
      >
        {({ loading, error, data, refetch }) => {
          if (loading) {
            return <ContentLoading />;
          } 

          if (error) {
            return <ErrorPage error={error}/>
          }
          return (
            <ReviewQueueImagePage 
              item={data.item} 
              reviewQueueItem={data.reviewQueueItem}
              labels={this.loadLabels(data.imageLabels)} 
              categorySets={data.categorySets}
              refetch={refetch}
            />
          );
        }}
      </Query>
    );
  }
}

export default ReviewQueueImagePageBase;
