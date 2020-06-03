import {
  Button,
  createStyles,
  FormControl,
  FormGroup,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import gql from 'graphql-tag';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { GET_CATEGORY_SETS } from '../../../../common-gql-queries';
import {
  IBatchLabelingInput,
  ICategory,
  ICategorySet,
  IImage,
} from '../../../../models';
import { getBatchImageLabels } from '../../../../store/batch-image-labeling/selectors';
import ApolloErrorPage from '../../../ApolloErrorPage';
import ContentLoading from '../../../ContentLoading';
import ImageTile from './ImageTile';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 0',
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 1 0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'scroll',
      padding: theme.spacing(3),
    },
    row: {
      flex: '1 1 0',
      display: 'flex',
      flexWrap: 'nowrap',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 150,
    },
    title: {
      marginRight: theme.spacing(2),
    },
  }),
);

interface IState {
  cols: number;
  categorySet: null | ICategorySet;
  selectedCategory: null | ICategory;
}

export default function BatchImageLabeler() {
  const classes = useStyles();
  const { projectId, collectionId } = useParams();
  const categorySetsQuery = useQuery<IGetCategorySets>(GET_CATEGORY_SETS, {
    variables: { projectId },
  });
  const [getBatch, getBatchResult] = useMutation<IGetBatch>(GET_BATCH);
  const [submitBatchMutation, submitBatchResult] = useMutation(SUBMIT_BATCH);
  const imageLabelsMap = useSelector(getBatchImageLabels);
  const [state, setState] = useState<IState>({
    cols: 3,
    categorySet: null,
    selectedCategory: null,
  });

  useEffect(
    () => {
      getBatch({
        variables: { collectionId: parseInt(collectionId, 10), batchSize: 5 },
      });
    },
    // eslint-disable-next-line
    [],
  );

  const allImagesLabeled = (batchImages: IImage[]) => {
    const labeledImageIds = Array.from(imageLabelsMap.keys()).sort();
    const allImageIds = batchImages.map(x => x.id).sort();
    return _.isEqual(labeledImageIds, allImageIds);
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

    const category = categorySet.categories.find(
      (x) => x.name === value?.value,
    );
    if (!category) {
      return;
    }

    setState({
      ...state,
      selectedCategory: category,
    });
  };

  const submitBatch = async () => {
    let batchInputs: IBatchLabelingInput[] = [];

    imageLabelsMap.forEach((value, key) => {
      batchInputs = batchInputs.concat(value);
    });

    const res = await submitBatchMutation({
      variables: { batch: batchInputs },
    });

    if (!res.errors) {
      getBatch({
        variables: { collectionId: parseInt(collectionId, 10), batchSize: 5 },
      });
    }
  };

  const commonErr =
    categorySetsQuery.error || getBatchResult.error || submitBatchResult.error;
  if (commonErr) {
    return <ApolloErrorPage error={commonErr} />;
  }

  if (
    categorySetsQuery.loading ||
    getBatchResult.loading ||
    submitBatchResult.loading
  ) {
    return <ContentLoading />;
  }

  const catSets =
    categorySetsQuery.data?.ImageLabelingService_categorySets || [];
  const batch = getBatchResult.data?.ImageLabelingService_getBatch || [];
  const batchImages = batch.map((x) => x.image);
  const rows: (IImage | null)[][] = _.chunk(batchImages, state.cols);
  const lastRow = rows.length > 0 ? rows[rows.length - 1] : [];
  while (lastRow.length < state.cols) {
    lastRow.push(null);
  }

  const categorySetOptions = catSets.map((x) => ({
    value: x.id,
    label: x.name,
  }));

  const categoryOptions = state.categorySet
    ? state.categorySet.categories.map((x) => ({
        value: x.name,
        label: x.name,
      }))
    : [];

  const handleSelectCategorySet = (
    e: React.ChangeEvent<{}>,
    value: {
      value: number;
      label: string;
    } | null,
  ) => {
    const categorySet = catSets.find((x) => x.id === value?.value);
    setState({
      ...state,
      categorySet: categorySet ? categorySet : null,
    });
  };

  let content = (
    <>
      {rows.map((row, i) => (
        <div className={classes.row} key={i}>
          {row.map((img, j) => {
            if (!img) {
              return <div key={j} />;
            }
            return (
              <ImageTile
                key={j}
                imageId={img.id}
                imageUrl={img.url}
                categorySets={catSets}
                activeCategorySet={state.categorySet}
                activeCategory={state.selectedCategory}
              />
            );
          })}
        </div>
      ))}
    </>
  );

  if (rows.length === 0) {
    content = (
      <Typography>
        {'All images in this collection have been labeled.'}
      </Typography>
    );
  }

  return (
    <div className={classes.root}>
      <div>
        <Paper>
          <Toolbar variant="dense">
            <Typography variant="h6" className={classes.title}>
              {'Batch Image Labeling'}
            </Typography>
            <FormGroup row={true}>
              <FormControl className={classes.formControl}>
                <Autocomplete
                  onChange={handleSelectCategorySet}
                  options={categorySetOptions}
                  getOptionSelected={(a, b) => a.value === b.value}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category Set"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <Autocomplete
                  onChange={handleSelectCategory(state.categorySet)}
                  options={categoryOptions}
                  getOptionSelected={(a, b) => a.value === b.value}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            </FormGroup>
            <Typography>
              {'Select a category and then click images to assign it to them.'}
            </Typography>
          </Toolbar>
        </Paper>
        <form />
      </div>
      <div className={classes.content}>{content}</div>
      <div>
        <Paper>
          <Toolbar variant="dense">
            <Button variant="contained" onClick={submitBatch} disabled={!allImagesLabeled(batchImages)}>
              {'Submit Batch'}
            </Button>
          </Toolbar>
        </Paper>
        <form />
      </div>
    </div>
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
    ImageLabelingService_getBatch(
      collectionId: $collectionId
      batchSize: $batchSize
    ) {
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
            categorySetName
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

const SUBMIT_BATCH = gql`
  mutation($batch: [ImageLabelingService_BatchLabelingInput!]!) {
    ImageLabelingService_submitBatch(batch: $batch) {
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
            categorySetName
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
