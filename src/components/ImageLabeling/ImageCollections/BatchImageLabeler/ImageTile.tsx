import {
  createStyles,
  FormControl,
  FormGroup,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import {
  IBatchLabelingInput,
  ICategory,
  ICategorySet,
} from '../../../../models';
import * as batchLabelingState from '../../../../store/batch-image-labeling/actions';
import { getBatchImageLabels } from '../../../../store/batch-image-labeling/selectors';

const mapDispatch = {
  addLabel: batchLabelingState.addLabel,
  removeLabel: batchLabelingState.removeLabel,
  updateLabel: batchLabelingState.updateLabel,
};

const connector = connect(null, mapDispatch);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    img: {
      maxHeight: 300,
      maxWidth: '100%',
      objectFit: 'scale-down',
      verticalAlign: 'bottom',
      display: 'block',
      margin: 'auto',
    },
    imgContainer: {
      textAlign: 'center',
      display: 'inline-block',
    },
    root: {
      flex: '1 1 0',
      textAlign: 'center',
      padding: theme.spacing(1),
    },
    formControl: {
      minWidth: 150,
    },
    formGroup: {
      minWidth: 150,
      display: 'inline-block',
    },
  }),
);

interface IImageTileProps extends ConnectedProps<typeof connector> {
  imageId: number;
  categorySets: ICategorySet[];
  imageUrl: string;
  activeCategorySet: ICategorySet | null;
  activeCategory: ICategory | null;
}

interface IState {
  categorySet: null | ICategorySet;
  selectedCategory: null | ICategory;
}

function ImageTile(props: IImageTileProps) {
  const classes = useStyles();
  const imageLabels = useSelector(getBatchImageLabels).get(props.imageId) || [];
  const firstLabel = imageLabels.length > 0 ? imageLabels[0] : null;

  const categorySetId = firstLabel?.categorySetId || null;
  const catSet = props.categorySets.find((x) => x.id === categorySetId) || null;
  const category = firstLabel?.category || null;

  const onImageClick = () => {
    if (!props.activeCategorySet || !props.activeCategory) {
      return;
    }

    const newLabel: IBatchLabelingInput = {
      imageId: props.imageId,
      categorySetId: props.activeCategorySet.id,
      category: props.activeCategory.name,
    };

    if (firstLabel) {
      props.updateLabel(props.imageId, newLabel, 0);
    } else {
      props.addLabel(props.imageId, newLabel);
    }
  };

  if (props.imageUrl === '') {
    return <div className={classes.root} />;
  }

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
  };

  const categorySetOptions =
    props.categorySets?.map((x) => ({
      value: x.id,
      label: x.name,
    })) || [];

  const categoryOptions =
    catSet?.categories.map((x) => ({
      value: x.name,
      label: x.name,
    })) || [];

  let catSetOptionsValue;
  if (catSet) {
    catSetOptionsValue = {
      value: catSet.id,
      label: catSet.name,
    };
  } else if (props.categorySets.length > 0) {
    catSetOptionsValue = {
      value: props.categorySets[0].id,
      label: props.categorySets[0].name,
    };
  }

  return (
    <div className={classes.root}>
      <div className={classes.imgContainer}>
        <img
          className={classes.img}
          src={props.imageUrl}
          alt="batch"
          onClick={onImageClick}
        />
        <FormGroup row={true} className={classes.formGroup}>
          <FormControl className={classes.formControl}>
            <Autocomplete
              value={catSetOptionsValue}
              options={categorySetOptions}
              getOptionSelected={(a, b) => a.value === b.value}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField {...params} label="Category Set" variant="filled" />
              )}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <Autocomplete
              value={{
                value: category || '',
                label: category || '',
              }}
              getOptionSelected={(a, b) => a.value === b.value}
              onChange={handleSelectCategory(catSet)}
              options={categoryOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField {...params} label="Category" variant="filled" />
              )}
            />
          </FormControl>
        </FormGroup>
      </div>
    </div>
  );
}

export default connector(ImageTile);
