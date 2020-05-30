import { Typography, Theme, makeStyles, createStyles, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useMutation, useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
import { IImage, ICategorySet } from '../../../../models';
import { GET_CATEGORY_SETS } from '../../../../common-gql-queries';
import ImageTile from './ImageTile';
import _ from "lodash";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflowX: 'scroll',
    },
    row: {
      display: 'flex',
      flexWrap: 'nowrap',
    }
  }),
);

export default function BatchImageLabeler() {
  const classes = useStyles();
  const { projectId, collectionId } = useParams();
  const categorySetsQuery = useQuery<IGetCategorySets>(GET_CATEGORY_SETS, { variables: { projectId } });
  const [getBatch, getBatchResult] = useMutation<IGetBatch>(GET_BATCH);
  const [state, setState] = useState({
    cols: 3,
  });

  useEffect(() => {
    getBatch({
      variables: { collectionId: parseInt(collectionId, 10), batchSize: 5 }
    });
  }, []);

  const commonErr = categorySetsQuery.error || getBatchResult.error;
  if (commonErr) {
    return <ApolloErrorPage error={commonErr} />;
  }

  if (categorySetsQuery.loading || getBatchResult.loading) {
    return <ContentLoading />;
  }

  const catSets = categorySetsQuery.data?.ImageLabelingService_categorySets || [];
  const batch = getBatchResult.data?.ImageLabelingService_getBatch || [];
  const imageUrls = batch.map(x => x.image.url);

  const rows = _.chunk(imageUrls, state.cols);

  const lastRow = rows[rows.length - 1];
  while (lastRow.length < state.cols) {
    lastRow.push('');
  }
  return (
    <div className={classes.root}>
      <Typography>Batch Image Labeler</Typography>
        {rows.map((row, i) => (
          <div className={classes.row}>
            {row.map((url, j) => (
                <ImageTile imageUrl={url} categorySets={catSets} />
            ))}
          </div>
        ))}
    </div >
  );
}

interface IGetCategorySets {
  ImageLabelingService_categorySets: ICategorySet[];
}

interface IGetBatch {
  ImageLabelingService_getBatch: IBatchItem[];
}

interface IBatchItem {
  collectionId: number;
  imageId: number;
  status: string;
  labeler: string;
  image: IImage;
}

const GET_BATCH = gql`
  mutation($collectionId: Int!, $batchSize: Int!) {
    ImageLabelingService_getBatch(collectionId: $collectionId, batchSize: $batchSize) {
      collectionId
      imageId
      labeler
      status
      image {
        collectionId
        id
        name
        url
        maskUrl
        approvedBy
        labels {
          id
          imageId
          shape
          category {
            categorySetId
            name
          }
          value
          creator
        }
      }
    }
  }
`;
